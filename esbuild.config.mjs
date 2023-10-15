import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import { copy } from 'esbuild-plugin-copy';


const staticAssetsPlugin = {
    name: 'static-assets-plugin',
    setup(build) {
        build.onLoad({ filter: /.+/ }, (args) => {
            return {
                watchFiles: ['esbuild.config.mjs'],
                // watchFiles: ['styles.css', 'esbuild.config.mjs'],
            };
        });
    },
};

const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");
const TEST_VAULT = "_vault/asana-dev/.obsidian/plugins/obsidian-asana"

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["src/main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2020",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: `${TEST_VAULT}/main.js`,
	plugins: [
		staticAssetsPlugin,
		copy({
			assets: {
				from: ['./errata/**/*'],
				to: ['.'],
				watch: true,
			}
		}),
	]
});


if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}
