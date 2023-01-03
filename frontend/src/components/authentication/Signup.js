import React, {useState} from "react";
import { useToast } from '@chakra-ui/react'
import {Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const SignUp = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [loading, setLoading] = useState(false);

    const handleClick = () => setShow(!show);
    const toast = useToast(); 
    const history = useHistory();

    const submitHandler = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword || !phone){
            toast({
                title: 'Please fill all the fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }
        if(password != confirmpassword){
            toast({
                title: 'Password do not match',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const { data } = await axios.post("/api/user", {name, email, phone, password}, config);
            toast({
                title: 'Registration successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            // localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false)
            // history.push("/chats")
            window.location.reload(false);

        } catch (error) {
            toast({
                title: 'Error occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false)
        }
    };

    return <VStack spacing='5px'>
                <FormControl id='first-name' isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                        placeholder='Enter Your Name'
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl id='email' isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                        placeholder='Enter Your Email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl id='phone' isRequired>
                    <FormLabel>Phone</FormLabel>
                    <Input
                        placeholder='Enter Your Phone Number'
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </FormControl>
                <FormControl id='password' isRequired>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                    <Input
                        type={show ? 'text' : 'password'}
                        placeholder='Enter Your Password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button height="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                    </InputGroup>
                </FormControl>
                <FormControl id='confirmpassword' isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder='Confirm Your Password'
                            onChange={(e) => setConfirmpassword(e.target.value)}
                        />
                        <InputRightElement width="4.5rem">
                            <Button height="1.75rem" size="sm" onClick={handleClick}>
                                {show ? "Hide" : "Show"}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </FormControl>

                <Button
                    colorScheme="blue"
                    width="100%"
                    style={{ marginTop: 15 }}
                    onClick={submitHandler}
                >
                    Sign Up
                </Button>
            </VStack>;
};

export default SignUp;