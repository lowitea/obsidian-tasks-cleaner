import {
	App,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";

interface TasksCleanerSettings {
	daysThreshold: number;
	taskPattern: string;
	filenamePattern: string;
}

const DEFAULT_SETTINGS: TasksCleanerSettings = {
	daysThreshold: 7,
	taskPattern: "- \\[x\\].*?✅\\s*(\\d{4}-\\d{2}-\\d{2})",
	filenamePattern: "TODO",
};

export default class TasksCleanerPlugin extends Plugin {
	settings: TasksCleanerSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon("trash", "Remove old tasks", async () => {
			await this.cleanOldTasks();
		});

		this.addCommand({
			id: "tasks-cleaner-remove-old-tasks",
			name: "Remove old tasks",
			callback: async () => {
				await this.cleanOldTasks();
			},
		});

		this.addSettingTab(new TasksCleanerSettingTab(this.app, this));

		new Notice("Tasks Cleaner plugin loaded.");
	}

	async cleanOldTasks() {
		const files = this.app.vault.getMarkdownFiles();
		const now = new Date();
		const thresholdDate = new Date(
			now.getTime() - this.settings.daysThreshold * 24 * 60 * 60 * 1000,
		);

		const taskRegex = new RegExp(this.settings.taskPattern);

		const results: {
			file: TFile;
			linesToDelete: number[];
			taskCount: number;
			content: string;
		}[] = [];

		for (const file of files) {
			if (
				this.settings.filenamePattern &&
				!file.name.includes(this.settings.filenamePattern)
			)
				continue;

			const content = await this.app.vault.read(file);
			const lines = content.split("\n");

			const linesToDelete: number[] = [];
			let taskCount = 0;

			let i = 0;
			while (i < lines.length) {
				const line = lines[i];
				const match = line.match(taskRegex);

				if (match) {
					const doneDate = new Date(match[1]);
					if (doneDate < thresholdDate) {
						linesToDelete.push(i);
						taskCount++;

						let j = i + 1;
						while (j < lines.length && lines[j].match(/^\s+/)) {
							linesToDelete.push(j);
							j++;
						}
						i = j;
						continue;
					}
				}
				i++;
			}

			if (linesToDelete.length > 0) {
				results.push({ file, linesToDelete, taskCount, content });
			}
		}

		if (results.length === 0) {
			new Notice("There are no tasks to delete.");
			return;
		}

		new ConfirmModal(this.app, results, async () => {
			for (const result of results) {
				const newLines = result.content
					.split("\n")
					.filter((_, idx) => !result.linesToDelete.includes(idx));
				await this.app.vault.modify(result.file, newLines.join("\n"));
			}
			new Notice("Outdated tasks have been deleted.");
		}).open();
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ConfirmModal extends Modal {
	constructor(
		app: App,
		private results: { file: TFile; taskCount: number }[],
		private onConfirm: () => void,
	) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: "Confirmation of deletion" });

		const ul = contentEl.createEl("ul");
		for (const { file, taskCount } of this.results) {
			ul.createEl("li", {
				text: `${file.path}: ${taskCount} tasks will be deleted`,
			});
		}

		const button = contentEl.createEl("button", {
			text: "Clear",
			cls: "tasks-cleaner-button-clear",
		});
		button.onclick = () => {
			this.onConfirm();
			this.close();
		};
	}

	onClose() {
		this.contentEl.empty();
	}
}

class TasksCleanerSettingTab extends PluginSettingTab {
	plugin: TasksCleanerPlugin;

	constructor(app: App, plugin: TasksCleanerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Tasks Cleaner Cleaner" });

		new Setting(containerEl)
			.setName("Delete issues older than (days)")
			.setDesc(
				"Completed tasks older than this number of days will be deleted.",
			)
			.addText((text) =>
				text
					.setPlaceholder("for example, 7")
					.setValue(this.plugin.settings.daysThreshold.toString())
					.onChange(async (value) => {
						const num = parseInt(value);
						if (!isNaN(num)) {
							this.plugin.settings.daysThreshold = num;
							await this.plugin.saveSettings();
						}
					}),
			);

		new Setting(containerEl)
			.setName("Task template")
			.setDesc(
				"A regular expression for searching for completed tasks. It must contain the completion date.",
			)
			.addText((text) =>
				text
					.setPlaceholder("- [x] ... ✅ yyyy-mm-dd")
					.setValue(this.plugin.settings.taskPattern)
					.onChange(async (value) => {
						this.plugin.settings.taskPattern = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Filter by file name")
			.setDesc(
				"If specified, tasks will be cleared only in files containing this line in the name.",
			)
			.addText((text) =>
				text
					.setPlaceholder("TODO")
					.setValue(this.plugin.settings.filenamePattern)
					.onChange(async (value) => {
						this.plugin.settings.filenamePattern = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
