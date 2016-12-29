// @flow

export type Item = {
  id: number,
  title: string,
  isCompleted: boolean,
  isEditing: boolean,
}

export type SortType = '' | 'asc' | 'desc'

export type TodoListProps = {
  children?: React$Element<*>,
  onItemFilterOut: Function,
  onItemSort: Function,
  sortType: string,
}

export type TodoItemProps = {
  id: number,
  title: string,
  isCompleted: boolean,
  onFecthUpdateItem: Function,
  onItemEdit: Function,
}

export type TodoAddFormProps = {
  placeholderText: string,
  onFecthAddItem: (x: Item) => void,
}

export type TodoEditFormProps = {
  id: number,
  title: string,
  isCompleted: boolean,
  onFecthUpdateItem: Function,
}

export type TodoSearchFormProps = {
  placeholderText: string,
  onItemSearch: Function,
}
