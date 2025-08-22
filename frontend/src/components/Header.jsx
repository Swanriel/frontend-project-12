import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{ 
      padding: '10px 20px', 
      borderBottom: '1px solid #ccc',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <Link 
        to="/" 
        style={{ 
          textDecoration: 'none', 
          color: '#007bff',
          fontWeight: 'bold',
          fontSize: '18px'
        }}
      >
        Hexlet Chat
      </Link>

      {user && (
        <button 
          onClick={handleLogout}
          style={{
            padding: '5px 15px',
            border: '1px solid #dc3545',
            backgroundColor: 'transparent',
            color: '#dc3545',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Выйти
        </button>
      )}
    </header>
  );
};

export default Header;