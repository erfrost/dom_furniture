import { useState } from "react";
import Header from "../../components/Header/Header";
import styles from "../../styles/todos.module.css";
import Link from "next/link";

const Index = ({ todos: serverTodos }) => {
  const [todos, setTodos] = useState(serverTodos);

  console.log(todos);

  return (
    <>
      <Header />
      <div className={styles.Index}>
        <div className={styles.list}>
          {todos.map((todo) => (
            <Link
              href="/todos/[todoId]"
              as={`/todos/${todo.id}`}
              key={todo.id}
              className={styles.link}
            >
              <span className={styles.listTitle}>{todo.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");

  const todos = await response.json();

  return {
    props: {
      todos,
    },
  };
}

export default Index;
