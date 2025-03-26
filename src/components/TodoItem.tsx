import React from "react";
import { useTheme, Card, Flex, TextField, Text, Button } from "@aws-amplify/ui-react";
import { useState, KeyboardEvent } from "react";
import type { Schema } from "../../amplify/data/resource";

export function TodoItem({ todo, onDelete, onEdit }: {
  todo: Schema['Todo']['type'];
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, content: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.content || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { tokens } = useTheme();

  const handleSubmitEdit = async () => {
    if (editContent.trim() !== '' && editContent !== todo.content) {
      await onEdit(todo.id, editContent);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmitEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(todo.content || '');
    }
  };

  return (
    <Card
      variation="outlined"
      padding={tokens.space.small}
      data-testid={`todo-item-${todo.id}`}
    >
      <Flex alignItems="center" gap={tokens.space.small}>
        {isEditing ? (
          <TextField
            label=""
            flex="1"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSubmitEdit}
            autoFocus
            size="small"
            data-testid={`todo-edit-input-${todo.id}`} />
        ) : (
          <Text
            flex="1"
            color={tokens.colors.font.primary}
            textDecoration={'none'}
            onClick={() => {
              setIsEditing(true);
              setEditContent(todo.content || '');
            }}
            style={{ cursor: 'pointer' }}
            data-testid={`todo-content-${todo.id}`}
          >
            {todo.content}
          </Text>
        )}
        <Flex gap={tokens.space.xs}>
          {showDeleteConfirm ? (
            <>
              <Button
                variation="link"
                size="small"
                onClick={() => onDelete(todo.id)}
                data-testid={`todo-delete-confirm-${todo.id}`}
                color={tokens.colors.font.error}
              >
                Confirm
              </Button>
              <Button
                variation="link"
                size="small"
                onClick={() => setShowDeleteConfirm(false)}
                data-testid={`todo-delete-cancel-${todo.id}`}
              >
                Cancel
              </Button>
            </>
          ) : !isEditing && (
            <Button
              variation="link"
              size="small"
              color={tokens.colors.font.error}
              onClick={() => setShowDeleteConfirm(true)}
              data-testid={`todo-delete-${todo.id}`}
            >
              Delete
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}
