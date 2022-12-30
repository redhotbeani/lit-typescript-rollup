import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Todo } from '../interfaces';

const VisibilityFilters = {
	SHOW_ALL: 'All',
	SHOW_ACTIVE: 'Active',
	SHOW_COMPLETED: 'Completed',
};

@customElement('todo-view')
export class TodoView extends LitElement {
	static styles = css`
		.visibility-filters {
			display: flex;
			margin: 10px 0px;
		}

		.todo-item {
			border-bottom: 1px dotted;
    		padding: 6px;
    		position: relative;
		}

		.visibility-filters {
			display: flex;
			flex-direction: column;
		}

		.filter-item {
			display: flex;
			align-items: baseline;
			margin-right: 5px;
		}
	`;

	@state()
	private todos: Todo[] = [];

	@state()
	private filter = VisibilityFilters.SHOW_ALL;

	@state()
	private task = '';

	addTodo(): void {
		if (this.task) {
			this.todos = [
				...this.todos,
				{
					task: this.task,
					complete: false,
				},
			];
			this.task = '';
		}
	}

	shortcutListener(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			this.addTodo();
		}
	}

	updateTask(e: { target: { value: string } }) {
		this.task = e.target.value;
	}

	updateTodoStatus(updatedTodo: Todo) {
		this.todos = this.todos.map(todo =>
			updatedTodo === todo ? { ...updatedTodo, complete: !updatedTodo.complete } : todo
		);
	}

	onRadioChange(event: { target: { value: string } }): void {
		this.filter = event.target.value;
	}

	clearCompleted() {
		this.todos = this.todos.filter(todo => !todo.complete);
	}

	applyFilter(todos: Todo[]) {
		switch (this.filter) {
			case VisibilityFilters.SHOW_ACTIVE:
				return todos.filter((todo: Todo) => !todo.complete);
			case VisibilityFilters.SHOW_COMPLETED:
				return todos.filter((todo: Todo) => todo.complete);
			default:
				return todos;
		}
	}

	render() {
		return html`
			<div class="input-layout" @keyup="${this.shortcutListener}">
				<input type="text" id="fname" name="fname" .value="${this.task}" @change="${this.updateTask}" />
				<button type="button" @click="${this.addTodo}">Add Todo</button>
			</div>
			<div class="todos-list">
				${this.applyFilter(this.todos).map(
					(todo: Todo) => html`
						<div class="todo-item">
							<input type="checkbox" .checked="${todo.complete}" @change="${() => this.updateTodoStatus(todo)}" />
							${todo.task}
						</div>
					`
				)}
			</div>
			<div class="visibility-filters">
				<h2>Filter todo items:</h2>
				${Object.values(VisibilityFilters).map(
					filter => html`
						<div class="filter-item">
						<input type="radio" id="${filter}" name="fav_language" .value="${filter}" @change="${this.onRadioChange}" /><label for="html">${filter}</label>
				</div>
					`
				)}
				</div>
				<button type="button" @click="${this.clearCompleted}">Clear completed</button>
		`;
	}
}
