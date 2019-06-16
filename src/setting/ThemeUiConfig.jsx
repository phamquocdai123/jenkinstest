import { createMuiTheme } from '@material-ui/core/styles';
const color = '#fff';

export const INPUT_MU = createMuiTheme({
	palette: {
		primary: {
			main: '#02BF99'
		}
	},
	typography: {
		useNextVariants: true,
		fontFamily: [ 'Nunito' ]
	}
});

export const INPUT_LOGIN = createMuiTheme({
	palette: {
		common: { black: color, white: color },
		primary: { main: color, dark: color, light: color },
		text: { primary: color, secondary: color }
	},
	overrides: {
		MuiPaper: {
			root: {
				borderRadius: '22px'
			}
		},
		MuiInput: {
			underline: {
				'&:before': {
					borderBottom: `1px solid ${color}`
				}
			}
		},
		MuiInputLabel: {
			root: {
				fontSize: '1.2em'
			}
		},
		MuiBottomNavigation: {
			root: {
				height: 'auto',
				display: 'unset',
				backgroundColor: 'transparent',
				color: '#FF7062'
			}
		},
		MuiBottomNavigationAction: {
			root: {
				fontWeight: 'bold',
				fontSize: '1.5em'
			},
			label: {
				color: '#FFFFFFF'
			}
			// selected:{
			// 	color: '#FF7062',
			// 	fontSize: '2em'
			// }
		}
	},
	typography: {
		useNextVariants: true,
		fontFamily: [ 'Nunito' ]
	}
});

export const USER_PAGE = createMuiTheme({
	overrides: {
		MuiAppBar: {
			root: {
				background: 'linear-gradient(to right, #027C76 0%, #02BF99 70%)'
			}
		}
	},
	typography: {
		useNextVariants: true,
		fontFamily: [ 'Nunito' ]
	}
});

export const THEME = createMuiTheme({
	palette: {
		headerColor: '#f9c953',
		primary: {
			main: '#53e3a6'
		},
		secondary: {
			main: '#FF7062'
		}
	},
	typography: {
		// Use the system font instead of the default Roboto font.
		fontFamily: [ 'Nunito' ]
	}
});
