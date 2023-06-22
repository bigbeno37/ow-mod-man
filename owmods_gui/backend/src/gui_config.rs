use std::path::PathBuf;

use owmods_core::file::{deserialize_from_json, get_app_path, serialize_to_json};
use serde::{Deserialize, Serialize};
use typeshare::typeshare;

#[typeshare]
#[derive(Default, Serialize, Deserialize, Clone)]
pub enum Theme {
    #[default]
    White,
    Blue,
    Green,
    Pink,
    Purple,
    Yellow,
    Orange,
    Blurple,
    GhostlyGreen,
}

#[typeshare]
#[derive(Default, Serialize, Deserialize, Clone)]
pub enum Language {
    #[default]
    English,
    //BrazilianPortuguese,
    Wario,
}

const fn _default_true() -> bool {
    true
}

const fn _default_false() -> bool {
    false
}

#[typeshare]
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GuiConfig {
    #[serde(default = "Language::default")]
    language: Language,
    #[serde(default = "_default_true")]
    pub watch_fs: bool,
    #[serde(default = "_default_false")]
    no_warning: bool,
    #[serde(default = "_default_false")]
    pub log_multi_window: bool,
    #[serde(default = "_default_false")]
    auto_enable_deps: bool,
    #[serde(default = "_default_false")]
    pub no_log_server: bool,
    // Old
    #[serde(skip_serializing_if = "Option::is_none")]
    theme: Option<Theme>,
    #[serde(skip_serializing_if = "Option::is_none")]
    rainbow: Option<bool>,
}

impl Default for GuiConfig {
    fn default() -> Self {
        Self {
            theme: None,
            rainbow: None,
            language: Language::default(),
            watch_fs: true,
            no_warning: false,
            log_multi_window: false,
            auto_enable_deps: false,
            no_log_server: false,
        }
    }
}

impl GuiConfig {
    pub fn path() -> Result<PathBuf, anyhow::Error> {
        let path = get_app_path()?.join("gui_settings.json");
        Ok(path)
    }

    fn migrate(&mut self) -> bool {
        if self.theme.is_some() || self.rainbow.is_some() {
            self.theme = None;
            self.rainbow = None;
            return true;
        }
        false
    }

    fn read() -> Result<Self, anyhow::Error> {
        let mut conf = deserialize_from_json::<GuiConfig>(&Self::path()?)?;
        if conf.migrate() {
            conf.save()?;
        }
        Ok(conf)
    }

    fn write(config: &Self) -> Result<(), anyhow::Error> {
        serialize_to_json(config, &Self::path()?, true)
    }

    pub fn get() -> Result<Self, anyhow::Error> {
        if Self::path()?.is_file() {
            Self::read()
        } else {
            let new = Self::default();
            Self::write(&new)?;
            Ok(new)
        }
    }

    pub fn save(&self) -> Result<(), anyhow::Error> {
        Self::write(self)
    }
}
