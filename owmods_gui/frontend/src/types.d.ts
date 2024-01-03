/*
 Generated by typeshare 1.7.0
*/

export type EmptyParams = undefined;

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
    /** The path to the OWML install, defaults to `~/.local/share/OuterWildsModManager/OWML` */
    owmlPath: string;
    /** The URL to the database */
    databaseUrl: string;
    /** The URL to fetch alerts from */
    alertUrl: string;
    /** The mod warnings that have been shown to the user */
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
    /** The title of the warning */
    title: string;
    /** The body of the warning */
    body: string;
}

/** Represents a manifest file for a local mod. */
export interface ModManifest {
    /** The unique name of the mod */
    uniqueName: string;
    /** The name of the mod */
    name: string;
    /** The author of the mod */
    author: string;
    /** The version of the mod, usually in the format `major.minor.patch` */
    version: string;
    /** The name of the DLL file to load when starting the mod */
    filename?: string;
    /** The version of OWML this mod was built for */
    owmlVersion?: string;
    /** The dependencies of the mod */
    dependencies?: string[];
    /** The mods this mod will conflict with */
    conflicts?: string[];
    /** The paths to preserve when updating the mod */
    pathsToPreserve?: string[];
    /** A warning the mod wants to show to the user on start */
    warning?: ModWarning;
    /** An exe that runs before the game starts, a prepatcher. This is used for mods that need to patch the game before it starts */
    patcher?: string;
    /**
     * A link to donate to the mod. May only be for Patreon or PayPal. This is deprecated in favor of `donate_links`
     *
     * It's recommended you use [ModManifest::migrate_donation_link] to migrate this to `donate_links`
     * (this automatically handled if you're using [LocalDatabase])
     */
    donateLink?: string;
    /** A list of links to donate to the mod (this replaced `donate_link`) */
    donateLinks?: string[];
}

/** Represents an installed (and valid) mod */
export interface LocalMod {
    /** Whether the mod is enabled */
    enabled: boolean;
    /** Any non-critical errors that occurred when loading the mod */
    errors: ModValidationError[];
    /** The path to the mod */
    modPath: string;
    /** The manifest for the mod */
    manifest: ModManifest;
}

/** Represents a mod that completely failed to load */
export interface FailedMod {
    /** The error that caused the mod to fail to load */
    error: ModValidationError;
    /** The path to the mod */
    modPath: string;
    /** The path to the mod relative to the mods folder, this usually will match the unique name so it's good for display */
    displayPath: string;
}

/** Contains URLs for a mod's README */
export interface ModReadMe {
    /** The URL to the README in HTML format */
    htmlUrl: string;
    /** The URL to the README for download */
    downloadUrl: string;
}

/** A prerelease for a mod */
export interface ModPrerelease {
    /** The URL to download the prerelease from, always GitHub */
    downloadUrl: string;
    /** The version of the prerelease, usually in the format `major.minor.patch` */
    version: string;
}

/**
 * Contains URL for a mod's thumbnail
 *
 * Note these paths are relative to the database website:
 *
 * `https://ow-mods.github.io/ow-mod-db/thumbails/`
 *
 * This should be prepended to the URL to get the full URL.
 *
 * Also note that open_graph is always `None` for mods with a static thumbnail,
 * so to always get a static thumbnail use `main` and `open_graph` together:
 *
 * ```
 * # use owmods_core::mods::remote::ModThumbnail;
 *
 * let thumb = ModThumbnail {
 * main: Some("main.gif".to_string()),
 * open_graph: Some("open_graph.webp".to_string())
 * };
 *
 * let animated = thumb.main.unwrap();
 * let static_thumb = thumb.open_graph.unwrap_or(animated.clone());
 *
 * assert_eq!(animated, "main.gif");
 * assert_eq!(static_thumb, "open_graph.webp");
 * ```
 *
 */
export interface ModThumbnail {
    /** Main thumbnail, this will be animated if the mod has an animated thumbnail */
    main?: string;
    /** Open-graph image, this will always be a static image but will always be `None` on mods with a static thumbnail */
    openGraph?: string;
}

/** Represents a mod in the remote database */
export interface RemoteMod {
    /** The URL to download the mod from, always GitHub */
    downloadUrl: string;
    /** The number of times the mod has been downloaded, this uses GitHub releases */
    downloadCount: number;
    /** The version of the mod, usually in the format `major.minor.patch` */
    version: string;
    /** The name of the mod */
    name: string;
    /** The unique name of the mod */
    uniqueName: string;
    /** The description of the mod */
    description: string;
    /** The mod's README file, if it has one */
    readme?: ModReadMe;
    /** The slug of the mod, this is used for the URL on the website */
    slug: string;
    /** Whether the mod is "required" this is an artifact of old manager as it treated OWML (and the manager itself) as a mod and required it to be installed */
    required?: boolean;
    /** A link to the mod's repository on GitHub */
    repo: string;
    /** The author of the mod, based on GitHub author name */
    author: string;
    /** The display name of the author of the mod, manually set in the database */
    authorDisplay?: string;
    /** The parent of the mod if this mod is an addon, e.g. NH */
    parent?: string;
    /** The prerelease for the mod, if it has one */
    prerelease?: ModPrerelease;
    /** The thumbnail for the mod */
    thumbnail: ModThumbnail;
    /** Whether the mod is for the alpha version of the game, currently alpha support is not implemented */
    alpha?: boolean;
    /** The tags for the mod, these are manually set in the database */
    tags?: string[];
}

/** Represents the configuration for OWML */
export interface OWMLConfig {
    /** The path to the game */
    gamePath: string;
    debugMode: boolean;
    /** Whether to launch the game directly */
    forceExe: boolean;
    incrementalGC: boolean;
    /** The path to OWML */
    owmlPath?: string;
    /** The port to use for sending logs to */
    socketPort: number;
}

/** Represents a progress bar */
export interface ProgressBar {
    /** The ID of the progress bar */
    id: string;
    /** The unique name of the mod this progress bar is for, sometimes this will be None if the progress bar doesn't know what mod it's for */
    uniqueName?: string;
    /** The message of the progress bar */
    message: string;
    /** The current progress of the progress bar */
    progress: ProgressValue;
    /** The type of progress bar */
    progressType: ProgressType;
    /** The action this progress bar is reporting */
    progressAction: ProgressAction;
    /** The length of the progress bar */
    len: ProgressValue;
    /** Whether the progress bar succeeded or failed, and None if it hasn't finished */
    success?: boolean;
    /** The position of the progress bar, the higher the position the higher it is in the list */
    position: number;
}

/**
 * Represents a collection of progress bars
 * This is used as a generalized way to keep track of all the progress bars and their positions
 * This is also used to process progress payloads
 *
 * Note that this still needs to be setup in your logger implementation
 *
 * ```no_run
 * use owmods_core::progress::bars::ProgressBars;
 * use owmods_core::progress::ProgressPayload;
 * use std::sync::{Arc, Mutex};
 *
 * struct Logger {
 * progress_bars: Arc<Mutex<ProgressBars>>,
 * };
 *
 * impl log::Log for Logger {
 * #  fn enabled(&self, metadata: &log::Metadata) -> bool {
 * #        true
 * #  }
 * #  fn flush(&self) {}
 *
 * fn log(&self, record: &log::Record) {
 * if record.target() == "progress" {
 * // Get ProgressBars from your state somehow...
 * let mut progress_bars = self.progress_bars.lock().expect("Lock is tainted");
 * let payload = ProgressPayload::parse(&format!("{}", record.args())).unwrap();
 * let any_failed = progress_bars.process(payload);
 * // Then emit some sort of event to update your UI
 * // Also do stuff with any_failed, etc
 * }
 * }
 * }
 * ```
 */
export interface ProgressBars {
    /** A map of progress bars by their ID */
    bars: Record<string, ProgressBar>;
    counter: number;
}

/**
 * Represents the type of install that should be done when a protocol link is clicked
 * This is used to determine what to do with the payload
 */
export enum ProtocolVerb {
    /** Install a mod from the mod database */
    InstallMod = "installMod",
    /** Install a mod from a URL */
    InstallURL = "installURL",
    /** Install a mod's prerelease from the database */
    InstallPreRelease = "installPreRelease",
    /** Install a mod from a zip file */
    InstallZip = "installZip",
    /** Run the game while making sure the given mod is enabled */
    RunGame = "runGame",
    /** Unknown install type, means the protocol link was invalid and therefore should be ignored */
    Unknown = "unknown"
}

/**
 * Represents a payload receive by a protocol handler (link from the website)
 * All URLs should start with owmods://
 * Then they should follow with the verb they want like `install-mod` or `install-url`
 * Finally they should have the payload for the install
 *
 * If an invalid verb is given the [ProtocolVerb] will be set to [ProtocolVerb::Unknown]
 *
 * Some examples of valid URIs are:
 * - owmods://install-mod/Bwc9876.TimeSaver
 * - owmods://install-url/https://example.com/Mod.zip
 * - owmods://install-zip//home/user/Downloads/Mod.zip
 * - owmods://install-prerelease/Raicuparta.NomaiVR
 * - owmods://run-game/Bwc9876.TimeSaver
 */
export interface ProtocolPayload {
    /** The type of install that should be done */
    verb: ProtocolVerb;
    /** The payload for the install */
    payload: string;
}

/**
 * Represents the type of message sent from the game
 *
 * See [the OWML docs](https://owml.outerwildsmods.com/mod_helper/console.html#WriteLine) for what the types mean.
 */
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
    /** The name of the sender, usually the name of the mod */
    senderName?: string;
    /** The type of the sender, usually ModHelper */
    senderType?: string;
    /** The message sent from the game */
    message: string;
    /**
     * The type of message sent from the game
     * Note that the message sent calls this `type` so we have to alias it because type is a reserved keyword
     */
    messageType: SocketMessageType;
}

export interface LogLineCountUpdatePayload {
    port: LogPort;
    line: number;
}

export interface LogsBehindPayload {
    port: LogPort;
    behind: boolean;
}

export interface GameMessage {
    port: LogPort;
    message: SocketMessage;
    amount: number;
    timestamp: string;
}

export enum Language {
    Chinese = "Chinese",
    Wario = "Wario",
    English = "English"
}

export enum Theme {
    Blue = "Blue",
    Red = "Red",
    Pink = "Pink",
    Purple = "Purple",
    Blurple = "Blurple",
    OuterWildsOrange = "OuterWildsOrange",
    GhostlyGreen = "GhostlyGreen",
    NomaiBlue = "NomaiBlue",
    NomaiYellow = "NomaiYellow",
    Green = "Green"
}

export interface GuiConfig {
    language: Language;
    theme: Theme;
    watchFs: boolean;
    noWarning: boolean;
    logMultiWindow: boolean;
    autoEnableDeps: boolean;
    noLogServer: boolean;
    hideInstalledInRemote: boolean;
    hideModThumbnails: boolean;
    hideDlc: boolean;
    rainbow: boolean;
}

export interface LogPayload {
    logType: Level;
    target: string;
    message: string;
}

/** Represents a `LocalMod` that we aren't sure loaded successfully */
export type UnsafeLocalMod =
    /** A mod was loaded successfully */
    | { loadState: "valid"; mod: LocalMod }
    /** A mod failed to load */
    | { loadState: "invalid"; mod: FailedMod };

export type RemoteModOption =
    | { type: "loading"; data?: undefined }
    | { type: "connected"; data?: RemoteMod }
    | { type: "err"; data: Error };

export type Event =
    | { name: "localRefresh"; params: EmptyParams }
    | { name: "remoteRefresh"; params: EmptyParams }
    | { name: "remoteInitialized"; params: EmptyParams }
    | { name: "modBusy"; params: EmptyParams }
    | { name: "configReload"; params: EmptyParams }
    | { name: "guiConfigReload"; params: boolean }
    | { name: "owmlConfigReload"; params: EmptyParams }
    | { name: "gameStart"; params: LogPort }
    | { name: "logUpdate"; params: LogPort }
    | { name: "logLineCountUpdate"; params: LogLineCountUpdatePayload }
    | { name: "logFatal"; params: GameMessage }
    | { name: "logsBehind"; params: LogsBehindPayload }
    | { name: "protocolInvoke"; params: ProtocolPayload }
    | { name: "progressUpdate"; params: EmptyParams }
    | { name: "progressBatchFinish"; params: boolean }
    | { name: "dragEnter"; params: EmptyParams }
    | { name: "dragLeave"; params: EmptyParams }
    | { name: "openOwmlSetup"; params: EmptyParams }
    | { name: "requestReload"; params: string }
    /** Purposefully never used, some hooks only need to run once */
    | { name: "none"; params: EmptyParams };
