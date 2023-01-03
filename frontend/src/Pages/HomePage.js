import React, {useEffect} from "react";
import { Container, Box, Text, Tab, TabList, TabPanels, Tabs, TabPanel } from "@chakra-ui/react";
import { useHistory, us } from "react-router-dom"

import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/Signup";

const HomePage = () => {
    const history = useHistory();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
  
      if (user){
          history.push("/chats");
      }
    }, [history]);

    return (
        <Container maxW='xl' centerContent>
            <Box 
                d='flex' 
                justifyContent="center"
                p={3}
                bg={"white"}    
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily="Work sans" color="black">Chat App</Text>
            </Box>
            <Box bg="white" w="100%" p={4} borderRadius="lg" color="black" borderWidth="1px">
                <Tabs variant='soft-rounded'>
                    <TabList marginBottom='1em'>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel><Login/></TabPanel>
                        <TabPanel><SignUp/></TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}
export default HomePage;