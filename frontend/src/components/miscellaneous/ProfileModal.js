import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { IconButton, Button, Image, Text } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({user, children}) => {
    const {selectedChat, setSelectedChat, chats, setChats} = ChatState()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleClose = (closeChat) => {
        setChats(chats.filter(c => c._id !== closeChat._id))
        setSelectedChat()
        onClose()
    }
    return <>
        {
            children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    display={{base: "flex"}}
                    icon={<ViewIcon/>}
                    onClick={onOpen}
                />
            )
        }
        <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent h="410px">
                <ModalHeader
                    fontSize="40px"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >{user.name}
                </ModalHeader>
            <ModalCloseButton />
            <ModalBody
                display="flex"
                flexDir="column"
                alignItems="center"
                justifyContent="space-between"
            >
                <Image
                    borderRadius="full"
                    boxSize="150px"
                    src="https://picsum.photos/200"
                />
                
                <Text
                    fontSize={{base: "28px", md: "20px"}}
                    fontFamily="Work sans"
                >
                    Email: {user.email}
                </Text>
                <Text
                    fontSize={{base: "28px", md: "20px"}}
                    fontFamily="Work sans"
                >
                    Phone: {user.phone}
                </Text>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
                </Button>
                <Button 
                    key={selectedChat._id}  
                    colorScheme='red'
                    onClick={() => handleClose(selectedChat)}
                >
                    Close Chat
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
}
export default ProfileModal