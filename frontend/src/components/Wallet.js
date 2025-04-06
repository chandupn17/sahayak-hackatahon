 import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar,
  Avatar,
} from '@mui/material';
import {
  AccountBalance as WalletIcon,
  AccountBalance,
  CreditCard as CardIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  LocalAtm as CashIcon,
  ArrowUpward as IncomeIcon,
  ArrowDownward as ExpenseIcon,
  AccountBalanceWallet as WalletBalanceIcon,
} from '@mui/icons-material';

const Wallet = () => {
  const [balance, setBalance] = useState(2500);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [openTopUp, setOpenTopUp] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState('overview');
  const [sendMoneyOpen, setSendMoneyOpen] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');

  // Mock transaction history
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Credit', amount: 1000, date: '2025-04-01', description: 'Initial deposit' },
    { id: 2, type: 'Debit', amount: 250, date: '2025-04-02', description: 'Grocery shopping' },
    { id: 3, type: 'Debit', amount: 350, date: '2025-04-03', description: 'Medicine purchase' },
    { id: 4, type: 'Credit', amount: 2000, date: '2025-04-04', description: 'Family deposit' },
  ]);

  const handleTopUpOpen = () => {
    setOpenTopUp(true);
  };

  const handleTopUpClose = () => {
    setOpenTopUp(false);
    setTopUpAmount('');
    setPaymentMethod('card');
  };

  const handleTopUp = () => {
    if (!topUpAmount || isNaN(topUpAmount) || Number(topUpAmount) <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid amount',
        severity: 'error',
      });
      return;
    }

    setBalance(prevBalance => prevBalance + Number(topUpAmount));
    setSnackbar({
      open: true,
      message: `Successfully added ₹${topUpAmount} to your wallet`,
      severity: 'success',
    });
    handleTopUpClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSendMoneyOpen = () => {
    setSendMoneyOpen(true);
  };

  const handleSendMoneyClose = () => {
    setSendMoneyOpen(false);
    setSendAmount('');
    setRecipientId('');
  };

  const handleSendMoney = () => {
    if (!sendAmount || isNaN(sendAmount) || Number(sendAmount) <= 0) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid amount',
        severity: 'error',
      });
      return;
    }

    if (!recipientId) {
      setSnackbar({
        open: true,
        message: 'Please enter a recipient ID',
        severity: 'error',
      });
      return;
    }

    if (Number(sendAmount) > balance) {
      setSnackbar({
        open: true,
        message: 'Insufficient balance',
        severity: 'error',
      });
      return;
    }

    // Update balance
    setBalance(prevBalance => prevBalance - Number(sendAmount));
    
    // Add transaction
    const newTransaction = {
      id: Date.now(),
      type: 'Debit',
      amount: Number(sendAmount),
      date: new Date().toISOString().split('T')[0],
      description: `Money sent to ${recipientId}`,
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    setSnackbar({
      open: true,
      message: `Successfully sent ₹${sendAmount} to ${recipientId}`,
      severity: 'success',
    });
    
    handleSendMoneyClose();
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
          <WalletBalanceIcon sx={{ mr: 1, fontSize: 35 }} />
          My Wallet
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleTopUpOpen}
            sx={{ mr: 2 }}
          >
            Add Money
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PaymentIcon />}
            onClick={handleSendMoneyOpen}
          >
            Send Money
          </Button>
        </Box>
      </Box>
      
      {/* Tabs */}
      <Paper elevation={0} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', borderBottom: 1, borderColor: 'divider' }}>
          <Button
            variant={activeTab === 'overview' ? 'contained' : 'text'}
            onClick={() => handleTabChange('overview')}
            sx={{ 
              py: 1.5, 
              px: 3, 
              borderRadius: 0,
              backgroundColor: activeTab === 'overview' ? 'primary.main' : 'transparent',
              color: activeTab === 'overview' ? 'white' : 'text.primary',
              '&:hover': {
                backgroundColor: activeTab === 'overview' ? 'primary.dark' : 'action.hover',
              }
            }}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'transactions' ? 'contained' : 'text'}
            onClick={() => handleTabChange('transactions')}
            sx={{ 
              py: 1.5, 
              px: 3, 
              borderRadius: 0,
              backgroundColor: activeTab === 'transactions' ? 'primary.main' : 'transparent',
              color: activeTab === 'transactions' ? 'white' : 'text.primary',
              '&:hover': {
                backgroundColor: activeTab === 'transactions' ? 'primary.dark' : 'action.hover',
              }
            }}
          >
            Transactions
          </Button>
          <Button
            variant={activeTab === 'cards' ? 'contained' : 'text'}
            onClick={() => handleTabChange('cards')}
            sx={{ 
              py: 1.5, 
              px: 3, 
              borderRadius: 0,
              backgroundColor: activeTab === 'cards' ? 'primary.main' : 'transparent',
              color: activeTab === 'cards' ? 'white' : 'text.primary',
              '&:hover': {
                backgroundColor: activeTab === 'cards' ? 'primary.dark' : 'action.hover',
              }
            }}
          >
            Payment Methods
          </Button>
        </Box>
      </Paper>
      
      {activeTab === 'overview' && (
        <>
        {/* Balance Card */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'linear-gradient(120deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <WalletIcon sx={{ fontSize: 60, opacity: 0.8 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">Available Balance</Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              ₹{balance.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              Last updated: {new Date().toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleTopUpOpen}
              sx={{ 
                py: 1.5, 
                px: 3, 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              Top Up
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Quick Actions */}
      <Typography variant="h6" gutterBottom fontWeight="medium">
        Quick Actions
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <AddIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Add Money</Typography>
              <Typography variant="body2" color="text.secondary">
                Top up your wallet balance
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <CardIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Payment Methods</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage your payment options
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <HistoryIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Transaction History</Typography>
              <Typography variant="body2" color="text.secondary">
                View your past transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <AccountBalance color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Bank Accounts</Typography>
              <Typography variant="body2" color="text.secondary">
                Link or manage bank accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            Recent Transactions
          </Typography>
          <Button 
            variant="text" 
            endIcon={<HistoryIcon />}
            onClick={() => handleTabChange('transactions')}
          >
            View All
          </Button>
        </Box>
        <Paper elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
          {transactions.map((transaction, index) => (
            <React.Fragment key={transaction.id}>
              <Box sx={{ p: 2 }}>
                <Grid container alignItems="center">
                  <Grid item xs>
                    <Typography variant="subtitle1">{transaction.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.date}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: transaction.type === 'Credit' ? 'success.main' : 'error.main'
                      }}
                    >
                      {transaction.type === 'Credit' ? '+' : '-'}₹{transaction.amount}
                    </Typography>
                    <Chip 
                      label={transaction.type} 
                      size="small" 
                      color={transaction.type === 'Credit' ? 'success' : 'error'}
                      sx={{ float: 'right' }}
                    />
                  </Grid>
                </Grid>
              </Box>
              {index < transactions.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Paper>
      </Box>
        </>
      )}

      {activeTab === 'transactions' && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            All Transactions
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 3, 
                p: 1, 
                borderRadius: 1,
                bgcolor: 'success.light' 
              }}>
                <IncomeIcon sx={{ color: 'success.main', mr: 1 }} />
                <Box>
                  <Typography variant="body2" color="success.main" fontWeight="bold">
                    Income
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    ₹{transactions
                      .filter(t => t.type === 'Credit')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                p: 1,
                borderRadius: 1,
                bgcolor: 'error.light'
              }}>
                <ExpenseIcon sx={{ color: 'error.main', mr: 1 }} />
                <Box>
                  <Typography variant="body2" color="error.main" fontWeight="bold">
                    Expenses
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    ₹{transactions
                      .filter(t => t.type === 'Debit')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <FormControl variant="outlined" size="small" sx={{ width: 200 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                label="Filter"
                defaultValue="all"
              >
                <MenuItem value="all">All Transactions</MenuItem>
                <MenuItem value="credit">Income Only</MenuItem>
                <MenuItem value="debit">Expenses Only</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Divider sx={{ mb: 2 }} />
          {transactions.length > 0 ? (
            <Box>
              {transactions.map((transaction, index) => (
                <React.Fragment key={transaction.id}>
                  <Box sx={{ p: 2 }}>
                    <Grid container alignItems="center">
                      <Grid item xs={1}>
                        <Avatar sx={{ 
                          bgcolor: transaction.type === 'Credit' ? 'success.light' : 'error.light',
                          color: transaction.type === 'Credit' ? 'success.main' : 'error.main'
                        }}>
                          {transaction.type === 'Credit' ? <IncomeIcon /> : <ExpenseIcon />}
                        </Avatar>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography variant="subtitle1">{transaction.description}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {transaction.date}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: transaction.type === 'Credit' ? 'success.main' : 'error.main'
                          }}
                        >
                          {transaction.type === 'Credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </Typography>
                        <Chip 
                          label={transaction.type} 
                          size="small" 
                          color={transaction.type === 'Credit' ? 'success' : 'error'}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  {index < transactions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          ) : (
            <Typography variant="body1" textAlign="center" sx={{ py: 4 }}>
              No transactions found
            </Typography>
          )}
        </Paper>
      )}

      {activeTab === 'cards' && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            Payment Methods
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6">Visa Debit</Typography>
                  <CardIcon fontSize="large" />
                </Box>
                <Typography variant="h5" sx={{ my: 2 }}>**** **** **** 4589</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>CARD HOLDER</Typography>
                    <Typography>John Doe</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>EXPIRES</Typography>
                    <Typography>12/28</Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  position: 'absolute', 
                  top: -20, 
                  right: -20, 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  bgcolor: 'rgba(255,255,255,0.1)' 
                }} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  border: '2px dashed',
                  borderColor: 'divider',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover'
                  }
                }}
                onClick={handleTopUpOpen}
              >
                <AddIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                <Typography variant="h6" color="primary">
                  Add New Card
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Other Payment Methods
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    <CashIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">UPI</Typography>
                    <Typography variant="body2" color="text.secondary">
                      user@upi
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    <WalletIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">Net Banking</Typography>
                    <Typography variant="body2" color="text.secondary">
                      HDFC Bank
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                    <AddIcon />
                  </Avatar>
                  <Typography variant="subtitle1">Add New Method</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      {/* Top Up Dialog */}
      <Dialog open={openTopUp} onClose={handleTopUpClose} maxWidth="sm" fullWidth>
        <DialogTitle>Top Up Your Wallet</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              sx={{ mb: 3 }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                label="Payment Method"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="card">Credit/Debit Card</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="netbanking">Net Banking</MenuItem>
              </Select>
            </FormControl>

            {paymentMethod === 'card' && (
              <>
                <TextField
                  label="Card Number"
                  fullWidth
                  placeholder="XXXX XXXX XXXX XXXX"
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField label="Expiry Date" fullWidth placeholder="MM/YY" />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField label="CVV" fullWidth placeholder="XXX" />
                  </Grid>
                </Grid>
              </>
            )}

            {paymentMethod === 'upi' && (
              <TextField
                label="UPI ID"
                fullWidth
                placeholder="yourname@upi"
                sx={{ mb: 2 }}
              />
            )}

            {paymentMethod === 'netbanking' && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Bank</InputLabel>
                <Select label="Select Bank">
                  <MenuItem value="sbi">State Bank of India</MenuItem>
                  <MenuItem value="hdfc">HDFC Bank</MenuItem>
                  <MenuItem value="icici">ICICI Bank</MenuItem>
                  <MenuItem value="axis">Axis Bank</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTopUpClose}>Cancel</Button>
          <Button onClick={handleTopUp} variant="contained" color="primary">
            Add Money
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Money Dialog */}
      <Dialog open={sendMoneyOpen} onClose={handleSendMoneyClose} maxWidth="sm" fullWidth>
        <DialogTitle>Send Money</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Recipient ID"
              fullWidth
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              placeholder="Enter recipient ID or mobile number"
              sx={{ mb: 3 }}
            />
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={sendAmount}
              onChange={(e) => setSendAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              sx={{ mb: 3 }}
            />
            <TextField
              label="Note (Optional)"
              fullWidth
              placeholder="Add a note"
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSendMoneyClose}>Cancel</Button>
          <Button 
            onClick={handleSendMoney} 
            variant="contained" 
            color="primary"
            disabled={!sendAmount || !recipientId || isNaN(sendAmount) || Number(sendAmount) <= 0 || Number(sendAmount) > balance}
          >
            Send Money
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Wallet;
