#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

yargs(hideBin(process.argv))
	.command(
		"init [path]",
		"initialize PM2 config",
		(yargs) => {
			yargs
				.positional("path", {
					describe: "path to generate config for",
					default: "."
				})
				.option("nvm", {
					alias: "n",
					type: "string",
					describe: "Specify default node version"
				});
		},
		(argv) => {
			const pathArg = argv.path;
			if (!pathArg) {
				console.error("Path is required");
				process.exit(1);
			}
			if (!fs.existsSync(pathArg)) {
				console.error("Path does not exist:", pathArg);
				process.exit(1);
			}
			generatePM2Config(pathArg, argv.nvm);
		}
	)
	.demandCommand()
	.strict()
	.help().argv;

function generatePM2Config(basePath, nvmVersion) {
	const absoluteBasePath = path.resolve(basePath);
	const apps = fs
		.readdirSync(absoluteBasePath)
		.filter((file) => {
			return fs.statSync(path.join(absoluteBasePath, file)).isDirectory();
		})
		.map((dir) => {
			let app = {
				name: dir,
				cwd: path.join(absoluteBasePath, dir),
				script: "./pm2.start.sh"
			};
			if (nvmVersion) {
				app.exec_interpreter = `~/.nvm/versions/node/v${nvmVersion}/bin/node`;
			}
			return app;
		});

	const config = {
		apps
	};

	fs.writeFileSync(
		path.join(process.cwd(), "ecosystem.config.js"),
		"module.exports = " + JSON.stringify(config, null, 2)
	);
	console.log(
		"Generated config at",
		path.join(absoluteBasePath, "ecosystem.config.js")
	);
}
