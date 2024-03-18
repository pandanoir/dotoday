import type { MetaFunction } from '@remix-run/node';
import {
  ChangeEventHandler,
  DetailedHTMLProps,
  Fragment,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useState,
} from 'react';
import { useTodaysTodo } from './useTodaysTodo';

export const meta: MetaFunction = () => [
  { title: 'Dotoday' },
  { name: 'description', content: `today's todo list` },
];

const TodoItem = ({ children }: PropsWithChildren) => (
  <li className="dark:hover:bg-slate-800 hover:bg-slate-100 rounded">
    {children}
  </li>
);
const InputWithLabel = ({
  label,
  ...props
}: { label: ReactNode } & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => (
  <label className="form-control">
    <div className="label">
      <span className="label-text">{label}</span>
    </div>
    <input
      type="text"
      name="title"
      className="input input-bordered"
      {...props}
    />
  </label>
);
const CheckboxWithLabel = ({
  label,
  checked,
  onChange,
}: PropsWithChildren<{
  label: ReactNode;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}>) => (
  <div className="form-control">
    <label className="label cursor-pointer">
      <input
        type="checkbox"
        className="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="label-text">{label}</span>
    </label>
  </div>
);
const SwitchButton = ({
  checked,
  onToggle,
  on,
  off,
}: {
  checked: boolean;
  onToggle: (v: boolean) => void;
  on: ReactNode;
  off: ReactNode;
}) => (
  <label className="swap contents">
    <input
      type="checkbox"
      className="hidden"
      checked={checked}
      onChange={(e) => onToggle(e.target.checked)}
    />
    {checked ? (
      <div className="btn swap-on">{on}</div>
    ) : (
      <div className="btn swap-off">{off}</div>
    )}
  </label>
);

const Index = () => {
  const { todaysTodo, oldTodo, addTodo, toggleTodo } = useTodaysTodo();
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-y-6 sm:px-8 sm:w-96 px-5 w-screen">
      <ul>
        {todaysTodo.map(({ title, done, createdAt }) => (
          <Fragment key={createdAt}>
            <TodoItem>
              <CheckboxWithLabel
                checked={done}
                onChange={(e) => {
                  toggleTodo(createdAt, e.target.checked);
                }}
                label={done ? <s>{title}</s> : title}
              />
            </TodoItem>
            <div className="divider my-0" />
          </Fragment>
        ))}
      </ul>
      <form
        className="contents"
        onSubmit={(event) => {
          if (!(event.target instanceof HTMLFormElement)) {
            return;
          }
          event.preventDefault();
          const formData = new FormData(event.target);
          const title = formData.get('title');
          if (typeof title !== 'string') {
            return;
          }
          addTodo({ title, done: false, createdAt: Date.now() / 1000 });
          event.target.reset();
        }}
      >
        <InputWithLabel label="追加するタスク" placeholder="追加するタスク" />
        <button className="btn btn-primary w-24">追加</button>
      </form>

      <SwitchButton
        checked={checked}
        onToggle={setChecked}
        on="過去のTODOを隠す"
        off="過去のTODOを見る"
      />
      {checked && (
        <ul>
          {oldTodo.map(({ title, done, createdAt }) => (
            <Fragment key={createdAt}>
              <TodoItem>{done ? <s>{title}</s> : title}</TodoItem>
              <div className="divider my-0" />
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Index;
