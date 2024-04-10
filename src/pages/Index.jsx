import React, { useState } from "react";
import { Box, Button, Flex, Heading, Input, Text, Link, Table, Thead, Tbody, Tr, Th, Td, Select, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, FormLabel } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const { isOpen: isAddTaskOpen, onOpen: onAddTaskOpen, onClose: onAddTaskClose } = useDisclosure();
  const { isOpen: isEditTaskOpen, onOpen: onEditTaskOpen, onClose: onEditTaskClose } = useDisclosure();
  const { isOpen: isSignUpOpen, onOpen: onSignUpOpen, onClose: onSignUpClose } = useDisclosure();
  const [selectedTask, setSelectedTask] = useState(null);

  const handleLogin = () => {
    // Simulated login logic
    if (email === "admin@example.com" && password === "admin") {
      setIsAdmin(true);
      setLoggedIn(true);
    } else if (email === "user@example.com" && password === "user") {
      setLoggedIn(true);
    }
  };

  const handleSignUp = () => {
    // Simulated sign-up logic
    if (inviteLink === "admin_invite") {
      setIsAdmin(true);
      setLoggedIn(true);
    } else if (inviteLink === "user_invite") {
      setLoggedIn(true);
    }
  };

  const handleAddTask = (task) => {
    setTasks([...tasks, { ...task, id: tasks.length + 1, status: "Unclaimed" }]);
    onAddTaskClose();
  };

  const handleEditTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
    setTasks(updatedTasks);
    onEditTaskClose();
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const renderTaskActions = (task) => (
    <Flex>
      <IconButton
        icon={<FaEdit />}
        onClick={() => {
          setSelectedTask(task);
          onEditTaskOpen();
        }}
      />
      <IconButton icon={<FaTrash />} onClick={() => handleDeleteTask(task.id)} />
    </Flex>
  );

  return (
    <Box p={4}>
      {!loggedIn ? (
        <Flex direction="column" align="center">
          <Heading mb={4}>Task Management</Heading>
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password" mb={4}>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button onClick={handleLogin} mb={4}>
            Login
          </Button>
          <Text>
            Don't have an account?{" "}
            <Link onClick={onSignUpOpen} color="blue.500">
              Sign up
            </Link>{" "}
            with an invite link.
          </Text>
        </Flex>
      ) : (
        <>
          <Heading mb={4}>Welcome{isAdmin ? " Admin" : ""}</Heading>
          {isAdmin && (
            <>
              <Heading size="md" mb={2}>
                Users
              </Heading>
              <Table mb={4}>
                <Thead>
                  <Tr>
                    <Th>Email</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.email}</Td>
                      <Td>
                        <IconButton
                          icon={<FaTrash />}
                          onClick={() => {
                            const updatedUsers = users.filter((u) => u.id !== user.id);
                            setUsers(updatedUsers);
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
          <Flex justify="space-between" mb={4}>
            <Heading size="md">Tasks</Heading>
            <Button leftIcon={<FaPlus />} onClick={onAddTaskOpen}>
              Add Task
            </Button>
          </Flex>
          <Table>
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Description</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks.map((task) => (
                <Tr key={task.id}>
                  <Td>{task.title}</Td>
                  <Td>{task.description}</Td>
                  <Td>
                    <Select value={task.status} onChange={(e) => handleEditTask({ ...task, status: e.target.value })}>
                      <option value="Unclaimed">Unclaimed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="In Revision">In Revision</option>
                    </Select>
                  </Td>
                  <Td>{renderTaskActions(task)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}

      <Modal isOpen={isAddTaskOpen} onClose={onAddTaskClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Task</ModalHeader>
          <ModalBody>
            <FormControl id="title" mb={4}>
              <FormLabel>Title</FormLabel>
              <Input />
            </FormControl>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Input />
            </FormControl>
            <FormControl id="attachment" mb={4}>
              <FormLabel>Attachment</FormLabel>
              <Input type="file" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onAddTaskClose}>Cancel</Button>
            <Button colorScheme="blue" ml={3} onClick={() => handleAddTask({ title: "New Task", description: "Task description" })}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditTaskOpen} onClose={onEditTaskClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalBody>
            <FormControl id="title" mb={4}>
              <FormLabel>Title</FormLabel>
              <Input value={selectedTask?.title} onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })} />
            </FormControl>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Input value={selectedTask?.description} onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })} />
            </FormControl>
            <FormControl id="attachment" mb={4}>
              <FormLabel>Attachment</FormLabel>
              <Input type="file" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onEditTaskClose}>Cancel</Button>
            <Button colorScheme="blue" ml={3} onClick={() => handleEditTask(selectedTask)}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Index;
