/*
 Generated by typeshare 1.6.0
*/

/** Represents an alert gotten from the database. */
export interface Alert {
    /** Whether the alert should be shown */
    enabled: boolean;
    /** The severity for the alert, should be `info`, `warning`, or `error` */
    severity?: string;
    /** The message for the alert */
    message?: string;
    /** Displays a link or button in the cli and gui respectively. **Note this is limited to GitHub, Discord, and the Mods Website** */
    url?: string;
    /** Optional label to display for the link instead of "More Info" */
    urlLabel?: string;
}

/** Represents the core config, contains critical info needed by the core API */
export interface Config {
    owmlPath: string;
    databaseUrl: string;
    alertUrl: string;
    viewedAlerts: string[];
}

/** Represents an error with a [LocalMod] */
export type ModValidationError =
    /** The mod's manifest was invalid, contains the error encountered when loading it */
    | { errorType: "InvalidManifest"; payload: string }
    /** The mod is missing a dependency that needs to be installed, contains the unique name of the missing dep */
    | { errorType: "MissingDep"; payload: string }
    /** A dependency of the mod is disabled, contains the unique name of the disabled dep */
    | { errorType: "DisabledDep"; payload: string }
    /** There's another enabled mod that conflicts with this one, contains the conflicting mod */
    | { errorType: "ConflictingMod"; payload: string }
    /** The DLL the mod specifies in its `manifest.json` doesn't exist, contains the path (if even present) to the DLL specified by the mod */
    | { errorType: "MissingDLL"; payload?: string }
    /** There's another mod already in the DB with this mod's unique name, contains the path of the other mod that has the same unique name */
    | { errorType: "DuplicateMod"; payload: string }
    /** The mod is outdated, contains the newest version */
    | { errorType: "Outdated"; payload: string };

/** Represents a warning a mod wants to show to the user on start */
export interface ModWarning {
    title: string;
    body: string;
}

/** Represents a manifest file for a local mod. */
export interface ModManifest {
    uniqueName: string;
    name: string;
    author: string;
    version: string;
    filename?: string;
    owmlVersion?: string;
    dependencies?: string[];
    conflicts?: string[];
    pathsToPreserve?: string[];
    warning?: ModWarning;
    patcher?: string;
}

/** Represents an installed (and valid) mod */
export interface LocalMod {
    enabled: boolean;
    errors: ModValidationError[];
    modPath: string;
    manifest: ModManifest;
}

/** Represents a mod that completely failed to load */
export interface FailedMod {
    error: ModValidationError;
    modPath: string;
    displayPath: string;
}

/** Contains URLs for a mod's README */
export interface ModReadMe {
    htmlUrl: string;
    downloadUrl: string;
}

/** A prerelease for a mod */
export interface ModPrerelease {
    downloadUrl: string;
    version: string;
}

/** Represents a mod in the remote database */
export interface RemoteMod {
    downloadUrl: string;
    downloadCount: number;
    version: string;
    name: string;
    uniqueName: string;
    description: string;
    readme?: ModReadMe;
    slug: string;
    required?: boolean;
    repo: string;
    author: string;
    authorDisplay?: string;
    parent?: string;
    prerelease?: ModPrerelease;
    alpha?: boolean;
    tags?: string[];
}

/** Represents the configuration for OWML */
export interface OWMLConfig {
    gamePath: string;
    debugMode: boolean;
    forceExe: boolean;
    incrementalGC: boolean;
    owmlPath?: string;
    socketPort: number;
}

/** Represents the type of message sent from the game */
export enum SocketMessageType {
    Message = "message",
    Error = "error",
    Warning = "warning",
    Info = "info",
    Success = "success",
    Quit = "quit",
    Fatal = "fatal",
    Debug = "debug"
}

/** Represents a message sent from the game */
export interface SocketMessage {
    senderName?: string;
    senderType?: string;
    message: string;
    messageType: SocketMessageType;
}

export interface GameMessage {
    port: LogPort;
    message: SocketMessage;
}

export enum Language {
    English = "English",
    Wario = "Wario"
}

export interface GuiConfig {
    language: Language;
    watchFs: boolean;
    noWarning: boolean;
    logMultiWindow: boolean;
    autoEnableDeps: boolean;
    noLogServer: boolean;
    theme?: Theme;
    rainbow?: boolean;
}

export interface LogPayload {
    logType: Level;
    target: string;
    message: string;
}

export interface ProgressBar {
    id: string;
    uniqueName?: string;
    message: string;
    progress: ProgressValue;
    progressType: ProgressType;
    progressAction: ProgressAction;
    len: ProgressValue;
    success?: boolean;
    position: number;
}

export interface ProgressBars {
    bars: Record<string, ProgressBar>;
    counter: number;
}

export enum ProtocolInstallType {
    InstallMod = "installMod",
    InstallURL = "installURL",
    InstallPreRelease = "installPreRelease",
    Unknown = "unknown"
}

/**
 * Represents a payload receive by a protocol handler (link from the website)
 * All URLs should start with owmods://
 * Then they should follow with the install type they want like `install-mod` or `install-url`
 * Finally they should have the payload for the install
 *
 * If an invalid install type is given the [ProtocolInstallType] will be set to [ProtocolInstallType::Unknown]
 *
 * Some examples of valid URIs are:
 * - owmods://install-mod/Bwc9876.TimeSaver
 * - owmods://install-url/https://example.com/Mod.zip
 * - owmods://install-prerelease/Raicuparta.NomaiVR
 */
export interface ProtocolPayload {
    installType: ProtocolInstallType;
    payload: string;
}

/** Represents a `LocalMod` that we aren't sure loaded successfully */
export type UnsafeLocalMod =
    | { loadState: "valid"; mod: LocalMod }
    | { loadState: "invalid"; mod: FailedMod };
