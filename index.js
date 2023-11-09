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
			yargs.positional("path", {
				describe: "path to generate config for",
				default: "."
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
			generatePM2Config(pathArg);
		}
	)
	.demandCommand()
	.strict()
	.help().argv;

function generatePM2Config(basePath) {
	const absoluteBasePath = path.resolve(basePath);
	const apps = fs
		.readdirSync(absoluteBasePath)
		.filter((file) => {
			return fs.statSync(path.join(absoluteBasePath, file)).isDirectory();
		})
		.map((dir) => {
			return {
				name: dir,
				cwd: path.join(absoluteBasePath, dir),
				script: "./pm2.start.sh"
			};
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
