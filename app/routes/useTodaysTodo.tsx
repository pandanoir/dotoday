import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { withPrefix } from '~/utils/withPrefix';
import { Todo } from './Todo';

export const useTodaysTodo = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const hasInitialized = useRef(false);
  const [visitedAt, setVisitedAt] = useState(0); // sec
  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;
    setVisitedAt(Date.now() / 1000);

    const todo = localStorage.getItem(withPrefix`todo`);
    if (todo === null) {
      return;
    }
    setTodo(JSON.parse(todo));
  }, []);

  const todaysTodo = useMemo(
    () =>
      visitedAt === 0
        ? []
        : todo.filter((item) => visitedAt - item.createdAt <= 24 * 60 * 60), // 24時間経過していないタスクを表示
    [todo, visitedAt],
  );
  const oldTodo = useMemo(
    () =>
      visitedAt === 0
        ? []
        : todo.filter((item) => visitedAt - item.createdAt > 24 * 60 * 60), // 24時間経過しているタスクを選択
    [todo, visitedAt],
  );

  return {
    todaysTodo,
    oldTodo,
    addTodo: useCallback((todo: Todo) => {
      setTodo((list) => [...list, todo]);
    }, []),
    toggleTodo: useCallback((createdAt: number, done: boolean) => {
      setTodo((list) => {
        const index = list.findIndex((x) => x.createdAt === createdAt);
        const copied = [...list];
        copied[index] = { ...copied[index], done };
        return copied;
      });
    }, []),
  };
};
