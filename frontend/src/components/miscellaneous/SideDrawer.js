import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Button, Tooltip, Menu, MenuButton, MenuList, MenuItem, MenuDivider, useToast, Spinner } from "@chakra-ui/react"
import { BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from "../../Context/ChatProvider";
import MyProfileModal from "./MyProfileModal";
import { useHistory } from "react-router-dom"
import { useDisclosure } from "@chakra-ui/hooks";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Input
  } from '@chakra-ui/react'
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const {user, setSelectedChat, chats, setChats} = ChatState()

    const history = useHistory()
    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        history.push("/")
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const handleSearch = async() => {
        if(!search){
            toast({
                title: "Please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            })
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: "Failed to load the results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
            return;
        }
    }

    const accessChat = async(userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post("/api/chat", {userId}, config)

            if(!chats.find((c) => c._id === data._id)){
                setChats([data, ...chats])
            }
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            toast({
                title: "Error Fetching Chat",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }
    return(
        <div>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px"
            >
                <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fas fa-search"></i>
                        <Text d={{base: "none", md: "flex"}} px="4">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans">
                    Chat App
                </Text>
                <div>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name}/>
                        </MenuButton>
                        <MenuList>
                            <MyProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </MyProfileModal>
                            <MenuDivider/>
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                    <Box
                        display="flex"
                        pb={2}
                    >
                        <Input
                            placeholder="Search by phone or email"
                            mr={2}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button 
                            onClick={handleSearch}
                        >
                            Go
                        </Button>
                    </Box>
                    {loading ? (
                      <ChatLoading/>  
                    ) : (
                        searchResult?.map(user => (
                            <UserListItem
                                key={user.id}
                                user={user}
                                handleFunction={()=>accessChat(user._id)}
                            />
                        ))
                    )}
                    {loadingChat && <Spinner ml="auto" display="flex"/>}
                </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
export default SideDrawer
