import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;
const pathErrataDir = "./errata";
const pathManifest = `${pathErrataDir}/manifest.json`;
const pathVersions = `${pathErrataDir}/versions.json`;

// read minAppVersion from manifest.json and bump version to target version
let manifest = JSON.parse(readFileSync(pathManifest, "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync(pathManifest, JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync(pathVersions, "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync(pathVersions, JSON.stringify(versions, null, "\t"));
