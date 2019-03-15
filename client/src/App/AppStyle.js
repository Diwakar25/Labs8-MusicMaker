import styled from 'styled-components';
import img from "../components/Images/landingPageView.jpeg"

export const AppContainer = styled.div`
display: flex;
flex-direction: column;
width: 100%;
height:100%;
background-image: url(${img});
background-size: 100% 100%;
// background-position: center;
// background: linear-gradient(to bottom, #02bec4 0%, #0284A8 100%);
// overflow: hidden;
font-family: "Montserrat";"Helvetica", sans-serif;
font-size: 0.9rem;
position: fixed;

`;


export const HeaderContainer = styled.div`
// background: black;
// opacity: 0.6;
// filter: alpha(opacity=60);
`;

export const ContentContainer = styled.div`
display: flex;
justify-content: space-between;
`;

export const SidebarContainer = styled.div`
`;

export const PageViewContainer = styled.div`
`;


