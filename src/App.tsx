import { useEffect, useState, KeyboardEvent } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import {
  Button,
  Card,
  Collection,
  Flex,
  Heading,
  Text,
  TextField,
  View,
  WithAuthenticatorProps,
  useTheme,
  Divider,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { TodoItem } from "./components/TodoItem";
import { Modal } from "./components/Modal";

const client = generateClient<Schema>();

function App({ signOut }: WithAuthenticatorProps) {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTodoContent, setNewTodoContent] = useState("");
  const { tokens } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5;

  const paginatedTodos = todos.slice(
    (currentPage - 1) * todosPerPage,
    currentPage * todosPerPage
  );

  const totalPages = Math.ceil(todos.length / todosPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe();
  }, []);

  async function createTodo() {
    if (newTodoContent.trim()) {
      await client.models.Todo.create({ 
        content: newTodoContent
      });
      setNewTodoContent("");
      setShowModal(false);
    }
  }
  
  async function deleteTodo(id: string) {
    await client.models.Todo.delete({ id });
  }
  
  async function updateTodo(id: string, content: string) {
    await client.models.Todo.update({ id, content });
  }
  
  async function toggleTodoComplete(id: string, isComplete: boolean) {
    await client.models.Todo.update({ id, isComplete });
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      createTodo();
    }
  };

  return (
    <View
      backgroundColor={tokens.colors.background.secondary}
      padding={tokens.space.large}
      minHeight="100vh"
      data-testid="todo-app"
    >
      {/* Add overlay when modal is active */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}
      <Card variation="elevated">
        <Flex direction="column" gap={tokens.space.medium}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading level={1}>My Todos</Heading>
            <Button 
              variation="primary" 
              onClick={() => setShowModal(true)}
              data-testid="add-todo-button"
            >
              Add Todo
            </Button>
          </Flex>

          <Divider />

          {todos.length === 0 ? (
            <Flex 
              direction="column" 
              alignItems="center" 
              padding={tokens.space.large}
            >
              <Text color={tokens.colors.neutral[60]}>No todos yet. Create one to get started!</Text>
              <Button 
                variation="link"
                onClick={() => setShowModal(true)}
                marginTop={tokens.space.medium}
              >
                Create your first todo
              </Button>
            </Flex>
          ) : (
            <>
              <Collection
                type="list"
                items={paginatedTodos}
                gap={tokens.space.small}
                direction="column"
                data-testid="todo-list"
              >
                {(todo) => (
                  <TodoItem 
                    key={todo.id}
                    todo={todo} 
                    onDelete={deleteTodo}
                    onEdit={updateTodo}
                    onToggleComplete={toggleTodoComplete}
                  />
                )}
              </Collection>
              <Flex justifyContent="space-between" marginTop={tokens.space.medium}>
                <Button 
                  variation="link" 
                  onClick={handlePreviousPage} 
                  isDisabled={currentPage === 1}
                  data-testid="previous-page"
                >
                  Previous
                </Button>
                <Text>
                  Page {currentPage} of {totalPages}
                </Text>
                <Button 
                  variation="link" 
                  onClick={handleNextPage} 
                  isDisabled={currentPage === totalPages}
                  data-testid="next-page"
                >
                  Next
                </Button>
              </Flex>
            </>
          )}
        </Flex>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Flex direction="column" gap={tokens.space.medium}>
          <Heading level={3}>Add New Todo</Heading>
          <TextField
            label="Todo content"
            value={newTodoContent}
            onChange={(e) => setNewTodoContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter your todo item..."
            autoFocus
            hasError={newTodoContent.trim() === ""}
            errorMessage="Todo content cannot be empty"
            data-testid="new-todo-input"
          />
          <Text fontSize="0.8rem" color={tokens.colors.neutral[60]}>
            Press Enter to quickly add your todo
          </Text>
          <Flex gap={tokens.space.small} justifyContent="flex-end">
            <Button
              variation="quiet"
              onClick={() => setShowModal(false)}
              data-testid="new-todo-cancel"
            >
              Cancel
            </Button>
            <Button
              variation="primary"
              onClick={createTodo}
              isDisabled={newTodoContent.trim() === ""}
              data-testid="new-todo-save"
            >
              Add Todo
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </View>
  );
}

export default App;