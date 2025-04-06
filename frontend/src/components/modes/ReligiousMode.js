import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  IconButton,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Slider,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { 
  Send as SendIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  SkipNext as NextIcon,
  SkipPrevious as PrevIcon,
  VolumeUp as VolumeIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  MoreVert as MoreIcon,
  YouTube as YouTubeIcon,
  MusicNote as MusicIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import ReactPlayer from 'react-player/youtube';

const ReligiousMode = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedReligion, setSelectedReligion] = useState('hinduism');
  const [playing, setPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [volume, setVolume] = useState(80);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Sample devotional videos data
  const devotionalVideos = {
    hinduism: [
      { id: '3xyIQ9UxHQ8', title: 'Om Jai Jagdish Hare Aarti', artist: 'Anuradha Paudwal', thumbnail: 'https://img.youtube.com/vi/3xyIQ9UxHQ8/mqdefault.jpg' },
      { id: 'MOt90wEQtfE', title: 'Gayatri Mantra', artist: 'Suresh Wadkar', thumbnail: 'https://img.youtube.com/vi/MOt90wEQtfE/mqdefault.jpg' },
      { id: 'Y3dbfYiCebw', title: 'Hanuman Chalisa', artist: 'Hariharan', thumbnail: 'https://img.youtube.com/vi/Y3dbfYiCebw/mqdefault.jpg' },
      { id: 'Y-XsyOdBP1g', title: 'Shiv Tandav Stotram', artist: 'Shankar Mahadevan', thumbnail: 'https://img.youtube.com/vi/Y-XsyOdBP1g/mqdefault.jpg' },
      { id: 'TQHNkGKCKqg', title: 'Krishna Bhajan - Achyutam Keshavam', artist: 'Vikram Hazra', thumbnail: 'https://img.youtube.com/vi/TQHNkGKCKqg/mqdefault.jpg' },
    ],
    christianity: [
      { id: 'nQWFzMvCfLE', title: 'Amazing Grace', artist: 'Celtic Woman', thumbnail: 'https://img.youtube.com/vi/nQWFzMvCfLE/mqdefault.jpg' },
      { id: 'Qjnc0H8utks', title: 'How Great Is Our God', artist: 'Chris Tomlin', thumbnail: 'https://img.youtube.com/vi/Qjnc0H8utks/mqdefault.jpg' },
      { id: 'mHqgIL06M9o', title: 'What A Beautiful Name', artist: 'Hillsong Worship', thumbnail: 'https://img.youtube.com/vi/mHqgIL06M9o/mqdefault.jpg' },
      { id: 'sIaT8Jl2zpI', title: 'Oceans (Where Feet May Fail)', artist: 'Hillsong UNITED', thumbnail: 'https://img.youtube.com/vi/sIaT8Jl2zpI/mqdefault.jpg' },
      { id: 'W-yzk13kerY', title: '10,000 Reasons (Bless the Lord)', artist: 'Matt Redman', thumbnail: 'https://img.youtube.com/vi/W-yzk13kerY/mqdefault.jpg' },
    ],
    islam: [
      { id: 'RW-8VV_nZjo', title: 'Surah Yasin', artist: 'Mishary Rashid Alafasy', thumbnail: 'https://img.youtube.com/vi/RW-8VV_nZjo/mqdefault.jpg' },
      { id: 'vUUtdFNZwfM', title: 'Surah Rahman', artist: 'Abdul Rahman Al-Sudais', thumbnail: 'https://img.youtube.com/vi/vUUtdFNZwfM/mqdefault.jpg' },
      { id: 'GRjU8QpA1-A', title: 'Hasbi Rabbi', artist: 'Sami Yusuf', thumbnail: 'https://img.youtube.com/vi/GRjU8QpA1-A/mqdefault.jpg' },
      { id: 'YHSMnKX9FTQ', title: 'Asma ul Husna', artist: 'Maher Zain', thumbnail: 'https://img.youtube.com/vi/YHSMnKX9FTQ/mqdefault.jpg' },
      { id: 'W-yzk13kerY', title: 'Tala Al Badru Alayna', artist: 'Various Artists', thumbnail: 'https://img.youtube.com/vi/W-yzk13kerY/mqdefault.jpg' },
    ],
    sikhism: [
      { id: 'GuKRxJGEj30', title: 'Japji Sahib', artist: 'Bhai Harjinder Singh', thumbnail: 'https://img.youtube.com/vi/GuKRxJGEj30/mqdefault.jpg' },
      { id: 'GuKRxJGEj30', title: 'Rehras Sahib', artist: 'Bhai Jarnail Singh', thumbnail: 'https://img.youtube.com/vi/GuKRxJGEj30/mqdefault.jpg' },
      { id: 'GuKRxJGEj30', title: 'Sukhmani Sahib', artist: 'Bhai Gurpreet Singh', thumbnail: 'https://img.youtube.com/vi/GuKRxJGEj30/mqdefault.jpg' },
      { id: 'GuKRxJGEj30', title: 'Chaupai Sahib', artist: 'Bhai Harjinder Singh', thumbnail: 'https://img.youtube.com/vi/GuKRxJGEj30/mqdefault.jpg' },
      { id: 'GuKRxJGEj30', title: 'Anand Sahib', artist: 'Bhai Harbans Singh', thumbnail: 'https://img.youtube.com/vi/GuKRxJGEj30/mqdefault.jpg' },
    ],
    buddhism: [
      { id: 'cDCS19EOsrA', title: 'Om Mani Padme Hum', artist: 'Yoko Dharma', thumbnail: 'https://img.youtube.com/vi/cDCS19EOsrA/mqdefault.jpg' },
      { id: 'iG_lNuNUVd4', title: 'Medicine Buddha Mantra', artist: 'Deva Premal', thumbnail: 'https://img.youtube.com/vi/iG_lNuNUVd4/mqdefault.jpg' },
      { id: 'cNknqMpZ4uo', title: 'Heart Sutra', artist: 'Imee Ooi', thumbnail: 'https://img.youtube.com/vi/cNknqMpZ4uo/mqdefault.jpg' },
      { id: 'iG_lNuNUVd4', title: 'Amitabha Mantra', artist: 'Various Artists', thumbnail: 'https://img.youtube.com/vi/iG_lNuNUVd4/mqdefault.jpg' },
      { id: 'iG_lNuNUVd4', title: 'Green Tara Mantra', artist: 'Deva Premal', thumbnail: 'https://img.youtube.com/vi/iG_lNuNUVd4/mqdefault.jpg' },
    ],
  };
  
  // Get videos for the selected religion
  const getVideos = () => {
    return devotionalVideos[selectedReligion] || [];
  };
  
  // Handle video selection
  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
    setCurrentTrack(video);
    setShowPlayer(true);
    setPlaying(true);
  };
  
  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle religion change
  const handleReligionChange = (event) => {
    setSelectedReligion(event.target.value);
    setCurrentVideo(null);
    setCurrentTrack(null);
    setShowPlayer(false);
    setPlaying(false);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle player controls
  const togglePlay = () => setPlaying(!playing);
  const handleVolumeChange = (event, newValue) => setVolume(newValue);
  const handleBackToList = () => setShowPlayer(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to backend
    setResponse('Your question has been received. Response coming soon...');
    setQuery('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
        Religious Companion Mode
      </Typography>
      
      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        centered 
        sx={{ 
          mb: 4,
          '& .MuiTab-root': { fontSize: '1.1rem', fontWeight: 'medium', py: 1.5 }
        }}
      >
        <Tab label="Ask Questions" icon={<SearchIcon />} iconPosition="start" />
        <Tab label="Devotional Videos" icon={<YouTubeIcon />} iconPosition="start" />
        <Tab label="Music Player" icon={<MusicIcon />} iconPosition="start" />
      </Tabs>
      
      {/* Ask Questions Tab */}
      {activeTab === 0 && (
        <>
          <Typography variant="h6" paragraph align="center" sx={{ mb: 3 }}>
            Ask questions about religious practices, stories, or teachings
          </Typography>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Your Question"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                multiline
                rows={3}
                variant="outlined"
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { fontSize: '1.1rem', p: 0.5 }
                }}
                InputLabelProps={{
                  sx: { fontSize: '1.1rem' }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                disabled={!query.trim()}
                sx={{ float: 'right', px: 3, py: 1, fontSize: '1rem', borderRadius: 2 }}
              >
                Ask Question
              </Button>
            </form>
          </Paper>

          {response && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Response:
              </Typography>
              <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>{response}</Typography>
              </Paper>
            </Box>
          )}
        </>
      )}
      
      {/* Devotional Videos Tab */}
      {activeTab === 1 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Devotional Videos
            </Typography>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="religion-select-label">Select Religion</InputLabel>
              <Select
                labelId="religion-select-label"
                value={selectedReligion}
                label="Select Religion"
                onChange={handleReligionChange}
                sx={{ fontSize: '1rem' }}
              >
                <MenuItem value="hinduism">Hinduism</MenuItem>
                <MenuItem value="christianity">Christianity</MenuItem>
                <MenuItem value="islam">Islam</MenuItem>
                <MenuItem value="sikhism">Sikhism</MenuItem>
                <MenuItem value="buddhism">Buddhism</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {showPlayer && currentVideo ? (
            <Box sx={{ mb: 4 }}>
              <Button 
                startIcon={<BackIcon />} 
                onClick={handleBackToList}
                sx={{ mb: 2 }}
              >
                Back to Videos
              </Button>
              
              <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${currentVideo.id}`}
                    width="100%"
                    height="100%"
                    playing={playing}
                    volume={volume / 100}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  />
                </Box>
                
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>{currentVideo.title}</Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {currentVideo.artist}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <IconButton onClick={togglePlay} color="primary" size="large">
                      {playing ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
                    </IconButton>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, width: '100%' }}>
                      <VolumeIcon sx={{ mr: 2 }} />
                      <Slider
                        value={volume}
                        onChange={handleVolumeChange}
                        aria-labelledby="volume-slider"
                        sx={{ width: '100%', maxWidth: 200 }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {getVideos().map((video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card 
                    elevation={3} 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: 6
                      },
                      borderRadius: 2
                    }}
                  >
                    <CardActionArea onClick={() => handleVideoSelect(video)}>
                      <CardMedia
                        component="img"
                        height="160"
                        image={video.thumbnail}
                        alt={video.title}
                      />
                      <CardContent>
                        <Typography variant="h6" component="div" noWrap>
                          {video.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {video.artist}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
      
      {/* Music Player Tab */}
      {activeTab === 2 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Devotional Music
            </Typography>
            
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="music-religion-select-label">Select Religion</InputLabel>
              <Select
                labelId="music-religion-select-label"
                value={selectedReligion}
                label="Select Religion"
                onChange={handleReligionChange}
                sx={{ fontSize: '1rem' }}
              >
                <MenuItem value="hinduism">Hinduism</MenuItem>
                <MenuItem value="christianity">Christianity</MenuItem>
                <MenuItem value="islam">Islam</MenuItem>
                <MenuItem value="sikhism">Sikhism</MenuItem>
                <MenuItem value="buddhism">Buddhism</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2, 
                  height: '100%', 
                  borderRadius: 2,
                  bgcolor: '#f5f5f5'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                  Playlist
                </Typography>
                <List>
                  {getVideos().map((track, index) => (
                    <ListItem 
                      button 
                      key={index}
                      selected={currentTrack && currentTrack.id === track.id}
                      onClick={() => handleVideoSelect(track)}
                      sx={{ 
                        mb: 1, 
                        borderRadius: 1,
                        bgcolor: 'white',
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                          '&:hover': {
                            bgcolor: 'primary.light',
                          }
                        }
                      }}
                    >
                      <ListItemIcon>
                        <MusicIcon color={currentTrack && currentTrack.id === track.id ? 'primary' : 'inherit'} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={track.title} 
                        secondary={track.artist}
                        primaryTypographyProps={{
                          fontWeight: currentTrack && currentTrack.id === track.id ? 'bold' : 'regular',
                          color: currentTrack && currentTrack.id === track.id ? 'primary.main' : 'inherit'
                        }}
                      />
                      <IconButton 
                        edge="end" 
                        aria-label="more"
                        onClick={handleMenuOpen}
                      >
                        <MoreIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>Add to Favorites</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Download</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Share</MenuItem>
                </Menu>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {currentTrack ? (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 3 }}>
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${currentTrack.id}`}
                      width="100%"
                      height="100%"
                      playing={playing}
                      volume={volume / 100}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                  </Box>
                  
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 3 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {currentTrack.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {currentTrack.artist}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#f0f7ff',
                    mt: 'auto'
                  }}>
                    <IconButton color="primary" sx={{ mx: 1 }}>
                      <PrevIcon fontSize="large" />
                    </IconButton>
                    
                    <IconButton 
                      onClick={togglePlay} 
                      color="primary" 
                      sx={{ 
                        mx: 2,
                        p: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        }
                      }}
                    >
                      {playing ? 
                        <PauseIcon fontSize="large" /> : 
                        <PlayIcon fontSize="large" />
                      }
                    </IconButton>
                    
                    <IconButton color="primary" sx={{ mx: 1 }}>
                      <NextIcon fontSize="large" />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                    <VolumeIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Slider
                      value={volume}
                      onChange={handleVolumeChange}
                      aria-labelledby="volume-slider"
                      sx={{ width: '100%' }}
                    />
                  </Box>
                </Paper>
              ) : (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: '#f5f5f5'
                  }}
                >
                  <MusicIcon sx={{ fontSize: 80, color: 'primary.light', mb: 3 }} />
                  <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                    Select a track from the playlist to start playing
                  </Typography>
                  <Typography variant="body1" align="center" color="text.secondary">
                    Enjoy devotional music from various religions
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default ReligiousMode;
