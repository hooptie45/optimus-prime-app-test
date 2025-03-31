import React, { useState, useEffect, KeyboardEvent } from "react";
import { Button, Card, Collection, Flex, Heading, Text, TextField, Divider, useTheme } from "@aws-amplify/ui-react";
import { Modal } from "../components/Modal";
import { TodoItem } from "../components/TodoItem";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export const TodosView: React.FC = () => {
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

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    return () => subscription.unsubscribe();
  }, []);

  async function createTodo() {
    if (newTodoContent.trim()) {
      await client.models.Todo.create({ content: newTodoContent });
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createTodo();
    }
  };

  return (
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
            <Text color={tokens.colors.neutral[60]}>
              No todos yet. Create one to get started!
            </Text>
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
                />
              )}
            </Collection>
            <Flex justifyContent="space-between" marginTop={tokens.space.medium}>
              <Button
                variation="link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                isDisabled={currentPage === totalPages}
                data-testid="next-page"
              >
                Next
              </Button>
            </Flex>
          </>
        )}
      </Flex>

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
              variation="secondary" // Changed from "quiet" to "secondary"
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
    </Card>
  );
};
