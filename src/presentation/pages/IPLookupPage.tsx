import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Grid,
  GridItem,
  useToast,
  Icon,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  Flex,
  Link,
  Table,
  Tbody,
  Tr,
  Td,
  Heading,
  Divider,
  FormControl,
  FormLabel,
  Switch,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Textarea,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from '@chakra-ui/react';
import { FaShareAlt, FaEdit, FaCode } from 'react-icons/fa';
import { IPDetails } from '../../domain/entities/IPDetails';
import { IPLookupRepositoryImpl, IPModifyRepositoryImpl } from '../../data/repositories/IPLookupRepositoryImpl';

const IPLookupPage: React.FC = () => {
  const [ipAddress, setIpAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ipDetails, setIpDetails] = useState<IPDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableDetails, setEditableDetails] = useState<IPDetails | null>(null);
  const [isJsonMode, setIsJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.500');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputFocusBorder = useColorModeValue('brand.400', 'brand.200');
  const rowBg = useColorModeValue('gray.50', 'gray.700');

  const handleSearch = useCallback(async (searchIp: string) => {
    if (!searchIp) {
      toast({
        title: 'Error',
        description: 'Please enter an IP address',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
      return;
    }

    setIsLoading(true);
    try {
      const repository = new IPLookupRepositoryImpl();
      const ipData = await repository.getIPDetails(searchIp);
      setIpDetails(ipData);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch IP details',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch(ipAddress);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(e.target.value);
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setEditableDetails(ipDetails);
      setJsonText(JSON.stringify(ipDetails, null, 2));
      onOpen();
    } else {
      onClose();
    }
    setIsEditing(!isEditing);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      setEditableDetails(parsed);
      setHasChanges(true);
    } catch (error) {
      // Invalid JSON, don't update editableDetails
    }
  };

  const handlePrettyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid JSON format',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
    }
  };

  const handleInputFieldChange = (field: string, value: any) => {
    if (!editableDetails) return;
    
    const newDetails = { ...editableDetails };
    const fields = field.split('.');
    
    let current: any = newDetails;
    for (let i = 0; i < fields.length - 1; i++) {
      if (!current[fields[i]]) {
        current[fields[i]] = {};
      }
      current = current[fields[i]];
    }
    current[fields[fields.length - 1]] = value;
    
    setEditableDetails(newDetails);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!editableDetails) {
      toast({
        title: 'Error',
        description: 'No details to save',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
      return;
    }

    setIsModifying(true); // Start the spinner
    try {
      const dataToSave = isJsonMode ? JSON.parse(jsonText) : editableDetails;

      const repository = new IPModifyRepositoryImpl();
      await repository.modifyIPDetails(dataToSave);

      setIpDetails(dataToSave);
      setIsEditing(false);
      onClose();
      setHasChanges(false); // Reset changes
      toast({
        title: 'Success',
        description: 'IP details updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update IP details',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-right'
      });
    } finally {
      setIsModifying(false); // Stop the spinner
    }
  };

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;
      const value = e.currentTarget.value;

      // Insert tab or newline character
      const newValue =
        e.key === 'Tab'
          ? value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd)
          : value.substring(0, selectionStart) + '\n' + value.substring(selectionEnd);

      // Update the textarea value
      setJsonText(newValue);

      // Move the cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + (e.key === 'Tab' ? 2 : 1);
        }
      }, 0);
    }
  };

  const renderEditableField = (label: string, field: string, value: any) => (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input
        value={value || ''}
        onChange={(e) => handleInputFieldChange(field, e.target.value)}
        size="sm"
        bg={inputBg}
        borderColor={inputBorderColor}
        _hover={{ borderColor: inputFocusBorder }}
        _focus={{ borderColor: inputFocusBorder }}
      />
    </FormControl>
  );

  return (
    <VStack spacing={8} align="stretch" p={4}>
      <Box>
        <HStack justify="space-between" mb={6}>
          <HStack spacing={2}>
            <Heading size="lg">IP Lookup</Heading>
            <Icon as={FaShareAlt as any} color="blue.500" cursor="pointer" />
          </HStack>
          <Link color="blue.500" href="#" fontSize="sm">
            Buy me a coffee
          </Link>
        </HStack>

        <HStack spacing={4}>
          <Input
            placeholder="Enter IP Address"
            value={ipAddress}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            size="lg"
            bg={inputBg}
            borderWidth="1px"
            borderColor={borderColor}
            _placeholder={{ color: placeholderColor }}
            _hover={{ borderColor: 'brand.300' }}
            _focus={{
              borderColor: inputFocusBorder,
              boxShadow: `0 0 0 1px ${inputFocusBorder}`,
            }}
            borderRadius="lg"
          />
          <Button
            size="lg"
            onClick={() => handleSearch(ipAddress)}
            isLoading={isLoading}
            bgGradient="linear(to-r, brand.400, brand.600)"
            _hover={{
              bgGradient: 'linear(to-r, brand.500, brand.700)',
            }}
            _active={{
              bgGradient: 'linear(to-r, brand.600, brand.800)',
            }}
            color="white"
            borderRadius="lg"
            px={8}
          >
            Search
          </Button>
        </HStack>
      </Box>

      <Box borderWidth="1px" borderRadius="lg" bg={bgColor} borderColor={borderColor}>
        <Box p={6}>
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Geolocation Data</Heading>
            <IconButton
              aria-label="Edit"
              icon={<Icon as={FaEdit as any} boxSize={4} />}
              onClick={handleEditToggle}
              colorScheme="blue"
            />
          </HStack>
          <Text fontSize="sm" color="gray.600" mb={4}>
            The geolocation data uses <Link color="blue.500" href="#">GeoLite2-City</Link> database.
          </Text>

          <Table variant="simple" size="sm">
            <Tbody>
              <Tr bg={rowBg}>
                <Td fontWeight="medium">IP Address</Td>
                <Td>{ipDetails?.ip || '0.0.0.0'}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="medium">Continent</Td>
                <Td>
                  {ipDetails?.continent.names.en} 
                  {ipDetails?.continent.code ? ` (${ipDetails?.continent.code})` : '-'}
                </Td>
              </Tr>
              <Tr bg={rowBg}>
                <Td fontWeight="medium">Country</Td>
                <Td>
                  {ipDetails?.country.names.en} 
                  {ipDetails?.country.isoCode ? ` (${ipDetails.country.isoCode})` : ''}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="medium">City</Td>
                <Td>{ipDetails?.city.names.en || '-'}</Td>
              </Tr>
              <Tr bg={rowBg}>
                <Td fontWeight="medium">Postal Code</Td>
                <Td>{ipDetails?.postal.code || '-'}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="medium">Location</Td>
                <Td>{ipDetails?.location.latitude || 'N/A'}, {ipDetails?.location.longitude || 'N/A'} (±{ipDetails?.location.accuracyRadius || 0}m)</Td>
              </Tr>
              <Tr bg={rowBg}>
                <Td fontWeight="medium">Time Zone</Td>
                <Td>{ipDetails?.location.timeZone || '-'}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="medium">Registered Country</Td>
                <Td>
                  {ipDetails?.registeredCountry.names.en} 
                  {ipDetails?.registeredCountry.isoCode ? ` (${ipDetails.registeredCountry.isoCode})` : ''}
                </Td>
              </Tr>
              <Tr bg={rowBg}>
                <Td fontWeight="medium">Represented Country</Td>
                <Td>
                  {ipDetails?.representedCountry.names.en} 
                  {ipDetails?.representedCountry.isoCode ? ` (${ipDetails.representedCountry.isoCode})` : '-'}
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="medium">Anonymous Proxy</Td>
                <Td>{ipDetails?.traits.isAnonymousProxy ? 'Yes' : 'No'}</Td>
              </Tr>
              <Tr bg={rowBg}>
                <Td fontWeight="medium">Satellite Provider</Td>
                <Td>{ipDetails?.traits.isSatelliteProvider ? 'Yes' : 'No'}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="medium">Any Cast</Td>
                <Td>{ipDetails?.traits.isAnycast ? 'Yes' : 'No'}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader>
            <Text>Edit IP: {editableDetails?.ip}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody overflowY="auto">
            {isJsonMode ? (
              <Box position="relative" minH="500px" overflow="auto">
                <HStack align="start">
                  {/* Editable Textarea */}
                  <Textarea
                    ref={textareaRef}
                    value={jsonText}
                    onChange={handleJsonChange}
                    onKeyDown={handleTextareaKeyDown}
                    fontFamily="monospace"
                    minH="500px"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    zIndex="2"
                    position="relative"
                    color="inherit"
                    _hover={{ borderColor: inputFocusBorder }}
                    _focus={{ borderColor: inputFocusBorder }}
                    flex="1"
                    overflow="auto"
                  />
                </HStack>
              </Box>
            ) : (
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                {/* Basic Information */}
                <GridItem colSpan={2}>
                  <Box borderWidth="1px" borderRadius="lg" p={4} borderColor={borderColor}>
                    <Heading size="sm" mb={4}>Basic Information</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        {renderEditableField("IP Address", "ip", editableDetails?.ip)}
                      </GridItem>
                      <GridItem>
                        {renderEditableField("Postal Code", "postal.code", editableDetails?.postal.code)}
                      </GridItem>
                    </Grid>
                  </Box>
                </GridItem>

                {/* Location Details */}
                <GridItem colSpan={2}>
                  <Box borderWidth="1px" borderRadius="lg" p={4} borderColor={borderColor}>
                    <Heading size="sm" mb={4}>Location Details</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        {renderEditableField("Latitude", "location.latitude", editableDetails?.location.latitude)}
                      </GridItem>
                      <GridItem>
                        {renderEditableField("Longitude", "location.longitude", editableDetails?.location.longitude)}
                      </GridItem>
                      <GridItem>
                        {renderEditableField("Accuracy Radius", "location.accuracyRadius", editableDetails?.location.accuracyRadius)}
                      </GridItem>
                      <GridItem>
                        {renderEditableField("Time Zone", "location.timeZone", editableDetails?.location.timeZone)}
                      </GridItem>
                    </Grid>
                  </Box>
                </GridItem>

                {/* Continent Details */}
                <GridItem colSpan={2}>
                  <Box borderWidth="1px" borderRadius="lg" p={4} borderColor={borderColor}>
                    <Heading size="sm" mb={4}>Continent Details</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        {renderEditableField("Continent Code", "continent.code", editableDetails?.continent.code)}
                      </GridItem>
                      <GridItem colSpan={2}>
                        <Heading size="xs" mb={2}>Continent Names</Heading>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          {Object.entries(editableDetails?.continent.names || {}).map(([lang, name]) => (
                            <GridItem key={lang}>
                              {renderEditableField(`Name (${lang})`, `continent.names.${lang}`, name)}
                            </GridItem>
                          ))}
                        </Grid>
                      </GridItem>
                    </Grid>
                  </Box>
                </GridItem>

                {/* Country Details */}
                <GridItem colSpan={2}>
                  <Box borderWidth="1px" borderRadius="lg" p={4} borderColor={borderColor}>
                    <Heading size="sm" mb={4}>Country Details</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        {renderEditableField("Country ISO Code", "country.isoCode", editableDetails?.country.isoCode)}
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Is in European Union</FormLabel>
                          <Switch
                            isChecked={editableDetails?.country.isInEuropeanUnion}
                            onChange={(e) => handleInputFieldChange("country.isInEuropeanUnion", e.target.checked)}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <Heading size="xs" mb={2}>Country Names</Heading>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          {Object.entries(editableDetails?.country.names || {}).map(([lang, name]) => (
                            <GridItem key={lang}>
                              {renderEditableField(`Name (${lang})`, `country.names.${lang}`, name)}
                            </GridItem>
                          ))}
                        </Grid>
                      </GridItem>
                    </Grid>
                  </Box>
                </GridItem>

                {/* Subdivisions */}
                <GridItem colSpan={2}>
                  <Box borderWidth="1px" borderRadius="lg" p={4} borderColor={borderColor}>
                    <Heading size="sm" mb={4}>Subdivisions</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      {editableDetails?.subdivisions?.map((subdivision, index) => (
                        <React.Fragment key={index}>
                          <GridItem>
                            {renderEditableField(`ISO Code (${index + 1})`, `subdivisions.${index}.isoCode`, subdivision.isoCode)}
                          </GridItem>
                          <GridItem colSpan={2}>
                            <Heading size="xs" mb={2}>Subdivision Names</Heading>
                            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                              {Object.entries(subdivision.names || {}).map(([lang, name]) => (
                                <GridItem key={lang}>
                                  {renderEditableField(`Name (${lang})`, `subdivisions.${index}.names.${lang}`, name)}
                                </GridItem>
                              ))}
                            </Grid>
                          </GridItem>
                        </React.Fragment>
                      ))}
                    </Grid>
                  </Box>
                </GridItem>

                {/* City Information */}
                <GridItem colSpan={2}>
                  <Box borderWidth="1px" borderRadius="lg" p={4} borderColor={borderColor}>
                    <Heading size="sm" mb={4}>City Information</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem colSpan={2}>
                        <Heading size="xs" mb={2}>City Names</Heading>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          {Object.entries(editableDetails?.city.names || {}).map(([lang, name]) => (
                            <GridItem key={lang}>
                              {renderEditableField(`Name (${lang})`, `city.names.${lang}`, name)}
                            </GridItem>
                          ))}
                        </Grid>
                      </GridItem>
                    </Grid>
                  </Box>
                </GridItem>

                {/* Network Traits */}
                <GridItem colSpan={2}>
                  <Box borderWidth="1px" borderRadius="lg" p={4} borderColor={borderColor}>
                    <Heading size="sm" mb={4}>Network Traits</Heading>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Is Anonymous Proxy</FormLabel>
                          <Switch
                            isChecked={editableDetails?.traits.isAnonymousProxy}
                            onChange={(e) => handleInputFieldChange("traits.isAnonymousProxy", e.target.checked)}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Is Satellite Provider</FormLabel>
                          <Switch
                            isChecked={editableDetails?.traits.isSatelliteProvider}
                            onChange={(e) => handleInputFieldChange("traits.isSatelliteProvider", e.target.checked)}
                          />
                        </FormControl>
                      </GridItem>
                      <GridItem>
                        <FormControl>
                          <FormLabel>Is Anycast</FormLabel>
                          <Switch
                            isChecked={editableDetails?.traits.isAnycast}
                            onChange={(e) => handleInputFieldChange("traits.isAnycast", e.target.checked)}
                          />
                        </FormControl>
                      </GridItem>
                    </Grid>
                  </Box>
                </GridItem>
              </Grid>
            )}
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <HStack spacing={4}>
              <Button
                onClick={() => setIsJsonMode(!isJsonMode)}
                bgGradient="linear(to-r, brand.400, brand.600)"
                _hover={{
                  bgGradient: 'linear(to-r, brand.500, brand.700)',
                }}
                _active={{
                  bgGradient: 'linear(to-r, brand.600, brand.800)',
                }}
                color="white"
              >
                {isJsonMode ? 'View' : 'JSON'}
              </Button>
              {isJsonMode && (
                <Button
                  onClick={handlePrettyJson}
                  bgGradient="linear(to-r, brand.400, brand.600)"
                  _hover={{
                    bgGradient: 'linear(to-r, brand.500, brand.700)',
                  }}
                  _active={{
                    bgGradient: 'linear(to-r, brand.600, brand.800)',
                  }}
                  color="white"
                >
                  Pretty
                </Button>
              )}
            </HStack>
            <HStack>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                bgGradient="linear(to-r, brand.400, brand.600)"
                _hover={{
                  bgGradient: 'linear(to-r, brand.500, brand.700)',
                }}
                _active={{
                  bgGradient: 'linear(to-r, brand.600, brand.800)',
                }}
                color="white"
                isDisabled={!hasChanges}
              >
                <Box minW="100px" textAlign="center">
                  {isModifying ? <Spinner size="sm" /> : 'Save Changes'}
                </Box>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default IPLookupPage; 