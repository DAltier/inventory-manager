'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { db, auth } from '../../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';

const InventoryPage = () => {
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState(1);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [recipeLoading, setRecipeLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [recipesFetched, setRecipesFetched] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        fetchInventoryItems(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredItems(
        inventoryItems.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredItems(inventoryItems);
    }
  }, [searchQuery, inventoryItems]);

  const handleAddItem = async () => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'users', user.uid, 'inventoryItems'), {
        name: item,
        amount,
      });
      setItem('');
      setAmount(1);
      fetchInventoryItems(user.uid);
    } catch (error) {
      console.error('Error adding item: ', error);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'inventoryItems', id));
      fetchInventoryItems(user.uid);
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  const handleUpdateAmount = async (id, newAmount) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'inventoryItems', id), {
        amount: newAmount,
      });
      fetchInventoryItems(user.uid);
    } catch (error) {
      console.error('Error updating amount: ', error);
    }
  };

  const fetchInventoryItems = async (userId) => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        collection(db, 'users', userId, 'inventoryItems')
      );
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventoryItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Error fetching items: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRecipe = async () => {
    setRecipeLoading(true);
    setRecipesFetched(false);
    try {
      const ingredients = inventoryItems
        .map((item) => `${item.name} (${item.amount})`)
        .join(', ');
      const response = await axios.post('/api', {
        prompt: `
        Create a recipe using the following ingredients: ${ingredients}. 
        `,
      });
      setRecipes(response.data.split('\n'));
      setRecipesFetched(true);
    } catch (error) {
      console.error('Error fetching recipes: ', error);
      setRecipesFetched(true);
    } finally {
      setRecipeLoading(false);
    }
  };

  return (
    <Box className="main-container">
      <Navbar />
      <Box className="content-container">
        <Container className="inventory-container">
          <Box className="inventory-form">
            <Typography variant="h4" gutterBottom align="center" color="black">
              Manage Inventory Items
            </Typography>
            <TextField
              label="New Item"
              variant="outlined"
              className="inventory-textfield"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            <TextField
              label="Amount"
              type="number"
              variant="outlined"
              className="inventory-textfield"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              InputProps={{ inputProps: { min: 1 } }}
            />
            <Box className="inventory-button-container">
              <Button
                variant="contained"
                onClick={handleAddItem}
                disabled={loading}
                sx={{ backgroundColor: '#95989c', fontSize: 20 }}
              >
                Add Item
              </Button>
              <Button
                variant="contained"
                onClick={handleFetchRecipe}
                disabled={recipeLoading}
                sx={{ backgroundColor: '#95989c', fontSize: 20 }}
              >
                Fetch Recipe
              </Button>
            </Box>
            <Box mt={4}>
              <TextField
                label="Find Inventory Items"
                variant="outlined"
                className="inventory-textfield"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find items"
              />
            </Box>
            <List>
              {filteredItems.length > 0 ? (
                filteredItems.map(({ id, name, amount }) => (
                  <ListItem
                    key={id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: 1,
                      color: 'black',
                    }}
                  >
                    <Typography sx={{ flexGrow: 1 }}>
                      {name} (Amount: {amount})
                    </Typography>
                    <IconButton
                      onClick={() => handleUpdateAmount(id, amount - 1)}
                      disabled={amount <= 1}
                    >
                      <RemoveIcon sx={{ color: 'red' }} />
                    </IconButton>
                    <IconButton
                      onClick={() => handleUpdateAmount(id, amount + 1)}
                    >
                      <AddIcon sx={{ color: 'green' }} />
                    </IconButton>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteItem(id)}
                      sx={{ ml: 2, color: 'black', fontWeight: 'bold' }}
                    >
                      Delete
                    </Button>
                  </ListItem>
                ))
              ) : (
                <Typography
                  sx={{
                    color: 'black',
                  }}
                >
                  No items match the search query.
                </Typography>
              )}
            </List>
            <Box mt={3}>
              <Typography variant="h5" gutterBottom></Typography>
              {recipeLoading ? (
                <Typography
                  sx={{
                    color: 'black',
                  }}
                >
                  Loading recipes...
                </Typography>
              ) : recipesFetched ? (
                recipes.length > 0 ? (
                  <List>
                    {recipes.map((recipe, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          color: 'black',
                        }}
                      >
                        <Typography>{recipe}</Typography>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    sx={{
                      color: 'black',
                    }}
                  >
                    No recipes found.
                  </Typography>
                )
              ) : null}
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default InventoryPage;
