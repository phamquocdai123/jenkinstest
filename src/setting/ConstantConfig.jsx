//Slide Config
export const SLIDE_CONFIG = {
	dots: 'true',
	infinite: true,
	speed: 500,
	slidesToShow: 4,
	slidesToScroll: 4,
	initialSlide: 0,
	responsive: [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
				infinite: true,
				dots: true
			}
		},
		{
			breakpoint: 600,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2,
				initialSlide: 2
			}
		},
		{
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}
	]
};

//Stream Config
export const STREAM_CONFIG_FULL = {
	video: {
        width: {
            min: "960",
            max: "1600"
        },
        height: {
            min: "540",
            max: "900"
        }
    },
	audio: true
};

export const STREAM_CONFIG_OP1 = {
	video: false,
	audio: true
};

export const STREAM_CONFIG_OP2 = {
	video: true,
	audio: true
};

//Peer Config
export const PEER_CONFIG = {
	CONNECTION: {
		iceServers: [ { url: 'stun:172.20.10.3' }, { url: 'stun:stun.l.google.com:19302' } ]
	},
	CONSTRAINTS: {
		optional: [ { DtlsSrtpKeyAgreement: true } ]
	},
	SDP: {
		sdpSemantics: 'unified-plan'
	},
	URL: 'http://192.168.137.1:3004'
};
