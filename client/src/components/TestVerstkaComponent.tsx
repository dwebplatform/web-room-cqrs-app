
import styled from "styled-components";


// const colors = ['#242526','#484a4d' ,'#dadce1'];
const colors = {
  bg:'#242526',
  bgAccent:'#484a4d',
  text:'#dadce1'
}
const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
const Menu = styled.div`
    width: 200px;
`;
const MenuItem = styled.a`
    /* padding: 10px;
    border-bottom: 1px solid #eee; */
    text-decoration: none;
    color: ${colors.text};
`;
const Typography = styled.div`
  font-weight: 500;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
`;
const NavBar = styled.nav`
  height:100%;
  padding: 0 1rem;
  border-bottom: 2px;
`;
const NavBarNav = styled.ul`
  max-width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;

`;
export const TestVerstkaComponent = () => {
  return (
    <Container>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="icon-button"></a>
          </li>
        </ul>
      </nav>
      <Menu>
        <MenuItem><Typography>О нас</Typography></MenuItem>
        <MenuItem><Typography>Контакты</Typography></MenuItem>
        <MenuItem><Typography>Далее</Typography></MenuItem>
      </Menu>
    </Container>
  )
}