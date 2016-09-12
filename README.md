# TwoDark

It's like [OneDark][2] for Atom, but it's called [TwoDark][1] and works with
[Sublime Text][3].

## Why?

Even if other [OneDark][2] inspired theme for Sublime Text exists, 
I felt that they were all missing– for their own reasons –some of the details that I liked from the original. That's why I decided to roll the version that I wanted to use.

I hope you enjoy it.

## But, Is It Beautiful?

IDK, I'm just a README. [See][1] for yourself:

![TwoDark Screenshot][screenshot]

## How To Install

### Package Control

You'll find TwoDark listed as "Theme - TwoDark" on Package Control.

To install the theme using Package Control:

* Open Command Palette using menu item Tools -> Command Palette... (⇧⌘P on Mac)
* Choose Package Control: Install Package
* Find Theme - TwoDark and hit Enter

### Manual

To install the theme manually:

* [Download the zip][zip]
* Unzip and rename the folder `Theme - TwoDark`
* Copy the folder into `Packages` directory. Use `Sublime Text -> Preferences -> Browse Packages...` to open the directory on your system.

## Activation

Select `Sublime Text -> Preferences -> Settings - User` to modify your
preferences. (or <kbd>⌘</kbd><kbd>,</kbd> on Mac)

### Settings

```json
{
  "theme": "TwoDark.sublime-theme",
  "color_scheme": "Packages/Theme - TwoDark/TwoDark.tmTheme",
  "draw_shadows": false,
  "highlight_modified_tabs": true,
  "caret_extra_width": 1,
}
```

## Credits and Thanks

- GitHub for OneDark, Atom and all the good stuff.
- [Jannik Siebert][4] for the original App Icon design.
- [IceTimux][5] for [OneDark Color Scheme][6]


[1]: https://erremauro.github.io/TwoDark
[2]: https://github.com/atom/one-dark-ui
[3]: http://www.sublimetext.com
[4]: https://dribbble.com/janniks
[5]: https://github.com/IceTimux/
[6]: https://github.com/IceTimux/one-dark-sublime-text-3-color-scheme
[screenshot]: screenshots/TwoDark.png
[zip]: https://github.com/erremauro/TwoDark/archive/master.zip
