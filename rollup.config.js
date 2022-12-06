import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const packageJson = require("./package.json");

export default [
    {
        input: "src/index.ts",
        output: [
            // CJS is not for front-end
            // {
            //     file: packageJson.main,
            //     format: "cjs",
            //     sourcemap: true,
            // },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true,
            },
            {
                file: 'dist/mui-react-room.production.min.js',
                format: "umd",
                sourcemap: true,
                name: 'ApiRtcMuiReactRoom',
                globals: {
                    'react': 'React',
                    '@apirtc/apirtc': 'apiRTC',
                    '@apirtc/react-lib': 'ApiRtcReactLib',
                    '@apirtc/mui-react-lib': 'ApiRtcMuiReactLib',
                    '@mui/material/Box': 'MaterialUI.Box',
                    '@mui/material/Chip': 'MaterialUI.Chip',
                    '@mui/material/Grid': 'MaterialUI.Grid',
                    '@mui/material/Icon': 'MaterialUI.Icon',
                    '@mui/material/Button': 'MaterialUI.Button',
                    '@mui/material/IconButton': 'MaterialUI.IconButton',
                    '@mui/material/Stack': 'MaterialUI.Stack',
                }
            },
        ],
        plugins: [
            peerDepsExternal(),
            resolve(),
            commonjs(),
            typescript({ tsconfig: "./tsconfig.json" }),
            terser()
        ],
        //external: ["react", "react-dom", "@apirtc/apirtc"] // peerDepsExternal already sets this ?
    },
    {
        input: "dist/esm/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm" }],
        plugins: [dts()],
    },
];
