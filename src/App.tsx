import React from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './presentation/components/Sidebar';
import IPLookupPage from './presentation/pages/IPLookupPage';
import theme from './presentation/theme';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Flex minH="100vh">
          <Sidebar />
          <Box flex="1" p="4">
            <Routes>
              <Route path="/" element={<IPLookupPage />} />
              <Route path="/ip-lookup" element={<IPLookupPage />} />
            </Routes>
          </Box>
        </Flex>
      </Router>
    </ChakraProvider>
  );
};

export default App;
