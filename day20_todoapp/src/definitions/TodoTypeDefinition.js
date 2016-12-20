//@flow

export type Item = {
  id: number,
  title: string, 
  isCompleted: boolean,
}

export type TodoListProps = {
  children?: React$Element<*>,
}

export type TodoItemProps = { 
  title: string,
  style: Object,
  onItemClick: Function,
}

export type TodoAddFormProps = {
  placeholderText: string,
  onItemAdd: (x: Item) => void,
}
