import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { IconButton, Button, Image, Text, useToast } from "@chakra-ui/react";
import { ViewIcon, CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Editable,
    EditableInput,
    EditableTextarea,
    EditablePreview,
    Input,
    ButtonGroup,
    Flex
  } from '@chakra-ui/react'
import { useEditableControls } from "@chakra-ui/react";
import axios from "axios";

const MyProfileModal = ({user, children}) => {
    const [profileName, setProfileName] = useState()
    const [renameLoading, setRenameLoading] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast();

    const handleRename = async() => {
        if(!profileName) return
        
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            
            const {data} = await axios.put("/api/user/rename", {
                userId: user._id,
                name: profileName
            }, config)

            toast({
                title: 'Changes saved',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            setRenameLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
            setRenameLoading(false)
        }
        var existing = JSON.parse(localStorage.getItem("userInfo"))
        existing['name'] = profileName;
        localStorage.setItem('userInfo', JSON.stringify(existing));

        setProfileName("")
        onClose()
    }

    function EditableControls() {
        const {
          isEditing,
          getSubmitButtonProps,
          getCancelButtonProps,
          getEditButtonProps,
        } = useEditableControls()
    
        return isEditing ? (
          <ButtonGroup justifyContent='center' size='sm'>
            <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
            <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
          </ButtonGroup>
        ) : (
          <Flex justifyContent='center'>
            <IconButton size='sm' icon={<EditIcon />} {...getEditButtonProps()} />
          </Flex>
        )
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
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent="center"
                >
                    <Editable
                        textAlign='center'
                        defaultValue={user.name}
                        fontSize='30px'
                        isPreviewFocusable={false}
                        >
                        <EditablePreview />
                        <Input 
                            as={EditableInput} 
                            onChange={(e) => setProfileName(e.target.value)}
                        />
                        <EditableControls />
                    </Editable>
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
                    fontSize={{base: "20px", md: "20px"}}
                    fontFamily="Work sans"
                >
                    Email: {user.email}
                </Text>
                <Text
                    fontSize={{base: "20px", md: "20px"}}
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
                    colorScheme='blue' mr={3} 
                    variant="outline"
                    isLoading={renameLoading}
                    onClick={handleRename}
                >
                    Save Changes
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
}
export default MyProfileModal