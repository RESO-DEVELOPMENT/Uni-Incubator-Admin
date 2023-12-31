const Error = () => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta content="IE=edge" http-equiv="X-UA-Compatible">
            <meta content="width=device-width, initial-scale=1.0" name="viewport">
            <title>Error</title>
            <style>
                @import url(https://fonts.googleapis.com/css?family=opensans:500);
        
                body {
                    background: #33cc99;
                    color: #fff;
                    font-family: 'Open Sans', sans-serif;
                    max-height: 700px;
                    overflow: hidden;
                }
        
                .c {
                    text-align: center;
                    display: block;
                    position: relative;
                    width: 80%;
                    margin: 100px auto;
                }
        
                ._404 {
                    font-size: 220px;
                    position: relative;
                    display: inline-block;
                    z-index: 2;
                    height: 250px;
                    letter-spacing: 15px;
                }
        
                ._1 {
                    text-align: center;
                    display: block;
                    position: relative;
                    letter-spacing: 12px;
                    font-size: 4em;
                    line-height: 80%;
                }
        
                ._2 {
                    text-align: center;
                    display: block;
                    position: relative;
                    font-size: 20px;
                }
        
                .text {
                    font-size: 70px;
                    text-align: center;
                    position: relative;
                    display: inline-block;
                    margin: 19px 0px 0px 0px;
                    /* top: 256.301px; */
                    z-index: 3;
                    width: 100%;
                    line-height: 1.2em;
                    display: inline-block;
                }
        
        
                .btn {
                    background-color: rgb(255, 255, 255);
                    position: relative;
                    display: inline-block;
                    width: 358px;
                    padding: 5px;
                    z-index: 5;
                    font-size: 25px;
                    margin: 0 auto;
                    color: #33cc99;
                    text-decoration: none;
                    margin-right: 10px
                }
        
                .right {
                    float: right;
                    width: 60%;
                }
        
                hr {
                    padding: 0;
                    border: none;
                    border-top: 5px solid #fff;
                    color: #fff;
                    text-align: center;
                    margin: 0px auto;
                    width: 420px;
                    height: 10px;
                    z-index: -10;
                }
        
                hr:after {
                    content: "2022";
                    display: inline-block;
                    position: relative;
                    top: -0.75em;
                    font-size: 2em;
                    padding: 0 0.2em;
                    background: #33cc99;
                }
        
                .cloud {
                    width: 350px;
                    height: 120px;
        
                    background: #FFF;
                    background: linear-gradient(top, #FFF 100%);
                    background: -webkit-linear-gradient(top, #FFF 100%);
                    background: -moz-linear-gradient(top, #FFF 100%);
                    background: -ms-linear-gradient(top, #FFF 100%);
                    background: -o-linear-gradient(top, #FFF 100%);
        
                    border-radius: 100px;
                    -webkit-border-radius: 100px;
                    -moz-border-radius: 100px;
        
                    position: absolute;
                    margin: 120px auto 20px;
                    z-index: -1;
                    transition: ease 1s;
                }
        
                .cloud:after, .cloud:before {
                    content: '';
                    position: absolute;
                    background: #FFF;
                    z-index: -1
                }
        
                .cloud:after {
                    width: 100px;
                    height: 100px;
                    top: -50px;
                    left: 50px;
        
                    border-radius: 100px;
                    -webkit-border-radius: 100px;
                    -moz-border-radius: 100px;
                }
        
                .cloud:before {
                    width: 180px;
                    height: 180px;
                    top: -90px;
                    right: 50px;
        
                    border-radius: 200px;
                    -webkit-border-radius: 200px;
                    -moz-border-radius: 200px;
                }
        
                .x1 {
                    top: -50px;
                    left: 100px;
                    -webkit-transform: scale(0.3);
                    -moz-transform: scale(0.3);
                    transform: scale(0.3);
                    opacity: 0.9;
                    -webkit-animation: moveclouds 15s linear infinite;
                    -moz-animation: moveclouds 15s linear infinite;
                    -o-animation: moveclouds 15s linear infinite;
                }
        
                .x1_5 {
                    top: -80px;
                    left: 250px;
                    -webkit-transform: scale(0.3);
                    -moz-transform: scale(0.3);
                    transform: scale(0.3);
                    -webkit-animation: moveclouds 17s linear infinite;
                    -moz-animation: moveclouds 17s linear infinite;
                    -o-animation: moveclouds 17s linear infinite;
                }
        
                .x2 {
                    left: 250px;
                    top: 30px;
                    -webkit-transform: scale(0.6);
                    -moz-transform: scale(0.6);
                    transform: scale(0.6);
                    opacity: 0.6;
                    -webkit-animation: moveclouds 25s linear infinite;
                    -moz-animation: moveclouds 25s linear infinite;
                    -o-animation: moveclouds 25s linear infinite;
                }
        
                .x3 {
                    left: 250px;
                    bottom: -70px;
        
                    -webkit-transform: scale(0.6);
                    -moz-transform: scale(0.6);
                    transform: scale(0.6);
                    opacity: 0.8;
        
                    -webkit-animation: moveclouds 25s linear infinite;
                    -moz-animation: moveclouds 25s linear infinite;
                    -o-animation: moveclouds 25s linear infinite;
                }
        
                .x4 {
                    left: 470px;
                    botttom: 20px;
        
                    -webkit-transform: scale(0.75);
                    -moz-transform: scale(0.75);
                    transform: scale(0.75);
                    opacity: 0.75;
        
                    -webkit-animation: moveclouds 18s linear infinite;
                    -moz-animation: moveclouds 18s linear infinite;
                    -o-animation: moveclouds 18s linear infinite;
                }
        
                .x5 {
                    left: 200px;
                    top: 300px;
        
                    -webkit-transform: scale(0.5);
                    -moz-transform: scale(0.5);
                    transform: scale(0.5);
                    opacity: 0.8;
        
                    -webkit-animation: moveclouds 20s linear infinite;
                    -moz-animation: moveclouds 20s linear infinite;
                    -o-animation: moveclouds 20s linear infinite;
                }
        
                @-webkit-keyframes moveclouds {
                    0% {
                        margin-left: 1000px;
                    }
                    100% {
                        margin-left: -1000px;
                    }
                }
        
                @-moz-keyframes moveclouds {
                    0% {
                        margin-left: 1000px;
                    }
                    100% {
                        margin-left: -1000px;
                    }
                }
        
                @-o-keyframes moveclouds {
                    0% {
                        margin-left: 1000px;
                    }
                    100% {
                        margin-left: -1000px;
                    }
                }
        
                @import url("https://fonts.googleapis.com/css?family=Open+Sans:400,300");
        
                html {
                    font-size: 62.5%;
                }
        
                body {
                    font-size: 1.5em;
                    line-height: 1.6;
                    font-weight: 400;
                    font-family: 'Open Sans', Helvetica, Arial, sans-serif;
                    color: #222;
                }
        
                .container {
                    position: relative;
                    width: 100%;
                    max-width: 960px;
                    margin: 0 auto;
                    padding: 0 20px;
                    box-sizing: border-box;
                }
        
                .column, .columns {
                    width: 100%;
                    float: left;
                    box-sizing: border-box;
                }
        
                @media (min-width: 400px) {
                    .container {
                        width: 85%;
                        padding: 0;
                    }
                }
        
                @media (min-width: 550px) {
                    .container {
                        width: 80%;
                    }
        
                    h1, h2, h3, h4, h5, h6 {
                        margin-top: 0;
                        margin-bottom: 2rem;
                        font-weight: 300;
                    }
        
                    h1 {
                        font-size: 4.0rem;
                        line-height: 1.2;
                        letter-spacing: -.1rem;
                    }
        
                    h2 {
                        font-size: 3.6rem;
                        line-height: 1.25;
                        letter-spacing: -.1rem;
                    }
        
                    h3 {
                        font-size: 3.0rem;
                        line-height: 1.3;
                        letter-spacing: -.1rem;
                    }
        
                    h4 {
                        font-size: 2.4rem;
                        line-height: 1.35;
                        letter-spacing: -.08rem;
                    }
        
                    h5 {
                        font-size: 1.8rem;
                        line-height: 1.5;
                        letter-spacing: -.05rem;
                    }
        
                    h6 {
                        font-size: 1.5rem;
                        line-height: 1.6;
                        letter-spacing: 0;
                    }
        
        
                    @media (min-width: 550px) {
                        h1 {
                            font-size: 5.0rem;
                        }
        
                        h2 {
                            font-size: 4.2rem;
                        }
        
                        h3 {
                            font-size: 3.6rem;
                        }
        
                        h4 {
                            font-size: 3.0rem;
                        }
        
                        h5 {
                            font-size: 2.4rem;
                        }
        
                        h6 {
                            font-size: 1.5rem;
                        }
                    }
                    p {
                        margin-top: 0;
                    }
        
                    header {
                        display: -webkit-box;
                        display: -webkit-flex;
                        display: -ms-flexbox;
                        display: flex;
                        -webkit-box-pack: center;
                        -webkit-justify-content: center;
                        -ms-flex-pack: center;
                        justify-content: center;
                        width: 100%;
                        height: 100vh;
                        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#e55d87', endColorstr='#5fc3e4', GradientType=1);
                    }
        
                    .title {
                        -webkit-align-self: center;
                        -ms-flex-item-align: center;
                        align-self: center;
                        padding: 2rem;
                        max-width: 960px;
                        text-align: center;
                    }
        
                    .title .smallsep {
                        background: #fff;
                        height: 2px;
                        width: 70px;
                        margin: auto;
                        margin-top: 30px;
                        margin-bottom: 30px;
                    }
        
                    .title h1 {
                        font-size: 80px;
                        font-weight: 300;
                        text-transform: uppercase;
                        line-height: 0.85;
                        margin-bottom: 28px;
                        margin: 0;
                        padding: 0;
                        color: #FFFFFF;
                    }
        
                    .title h2 {
                        color: #FFFFFF;
                        font-size: 23px;
                        font-weight: 400;
                        text-transform: uppercase;
                        letter-spacing: 5px;
                        margin-top: 50px;
                    }
        
                    @media only screen and (max-height: 700px) {
                        .title h1 {
                            font-size: 80px;
                        }
                    }
                    .title p {
                        max-width: 600px;
                        margin: 0 auto;
                        line-height: 150%;
                    }
        
                    @media only screen and (max-width: 500px) {
                        .title h1 {
                            font-size: 65px;
                        }
                    }
                    .title .icon {
                        color: #FFFFFF;
                        font-size: 50px;
                    }
        
                    .main_nav {
                        position: fixed;
                        top: 0px;
                        max-height: 50px;
                        z-index: 999;
                        width: 100%;
                        padding-top: 17px;
                        background: none;
                        overflow: hidden;
                        -webkit-transition: all 0.3s;
                        transition: all 0.3s;
                        opacity: 0;
                        top: -100px;
                        padding-bottom: 6px;
                    }
        
                    @media only screen and (max-width: 766px) {
                        .main_nav {
                            padding-top: 25px;
                        }
                    }
                    .open-nav {
                        max-height: 400px !important;
                    }
        
                    .sticky {
                        background-color: #ffffff;
                        opacity: 1;
                        top: 0px;
                    }
        
                    nav {
                        width: 100%;
                        margin-top: 5px;
                    }
        
        
                    @media only screen and (max-width: 766px) {
                        .mobile-toggle {
                            display: none;
                            cursor: pointer;
                            font-size: 20px;
                            position: absolute;
                            right: 22px;
                            top: 0;
                            width: 30px;
                        }
        
                        @media only screen and (max-width: 766px) {
                            .mobile-toggle {
                                display: block;
                            }
                        }
                        .mobile-toggle span {
                            width: 30px;
                            height: 4px;
                            margin-bottom: 6px;
                            background: #000000;
                            display: block;
                        }
        
                        @-webkit-keyframes fade_move_down {
                            0% {
                                -webkit-transform: translate(0, -10px) rotate(45deg);
                                opacity: 0;
                            }
                            50% {
                                opacity: 1;
                            }
                            100% {
                                -webkit-transform: translate(0, 10px) rotate(45deg);
                                opacity: 0;
                            }
                        }
                        @-moz-keyframes fade_move_down {
                            0% {
                                -moz-transform: translate(0, -10px) rotate(45deg);
                                opacity: 0;
                            }
                            50% {
                                opacity: 1;
                            }
                            100% {
                                -moz-transform: translate(0, 10px) rotate(45deg);
                                opacity: 0;
                            }
                        }
                        @keyframes fade_move_down {
                            0% {
                                transform: translate(0, -10px) rotate(45deg);
                                opacity: 0;
                            }
                            50% {
                                opacity: 1;
                            }
                            100% {
                                transform: translate(0, 10px) rotate(45deg);
                                opacity: 0;
                            }
                        }
        
                        .u-full-width {
                            width: 100%;
                            box-sizing: border-box;
                        }
        
                        .u-max-full-width {
                            max-width: 100%;
                            box-sizing: border-box;
                        }
        
                        .u-pull-right {
                            float: right;
                        }
        
                        .u-pull-left {
                            float: left;
                        }
        
                        .container:after, .row:after, .u-cf {
                            content: "";
                            display: table;
                            clear: both;
                        }
        
                        .block {
                            width: 70px;
                            height: 2px;
                            margin-bottom: 50px;
                        }
                    }
                }
            </style>
        </head>
        <body>
        
        <div id="clouds">
            <div class="cloud x1"></div>
            <div class="cloud x1_5"></div>
            <div class="cloud x2"></div>
            <div class="cloud x3"></div>
            <div class="cloud x4"></div>
            <div class="cloud x5"></div>
        </div>
        <header id="header">
            <div class="main_nav">
                <div class="container">
                    <div class="mobile-toggle"><span></span> <span></span> <span></span></div>
                </div>
            </div>
            <div class="title">
                <h1 class="heading">SORRY</h1>
                <h2 class="heading">You do not have permission to access this page!</h2>
                <div class="smallsep heading"></div>
                </div>
        </header>
        
        
        <!-- <h1>
            You do not have permission to access this page !!
        </h1> -->
        </body>
        </html>
        `,
      }}
    />
  );
};

export default Error;
