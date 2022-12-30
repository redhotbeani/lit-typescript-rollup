import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import './views/TodoView';

export class Todo extends LitElement {
	@property({ type: String }) title = 'Lit Typescript Rollup';

	static styles = css`
		:host {

		}

		main {
			margin: 5rem;
			flex-grow: 1;
		}
	`;

	render() {
		return html`
			<main>
				<h1>${this.title} </h1>
				<todo-view></todo-view>
			</main>
		`;
	}
}
