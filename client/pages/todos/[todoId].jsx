import { useState } from "react";
import Header from "../../components/Header/Header";
import styles from "../../styles/todos.module.css";

const TodoItem = ({ todo: serverTodo }) => {
  const [todo, setTodo] = useState(serverTodo);

  return (
    <>
      <Header />
      <span className={styles.todoItem}>{todo.title}</span>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${query.todoId}`
  );

  const todo = await response.json();

  return {
    props: {
      todo,
    },
  };
}

export default TodoItem;
