# MediMate - Agent Guidelines

## Build, Lint & Test Commands

### Backend (Django)
- **Run server**: `cd backend && python manage.py runserver`
- **Run migrations**: `cd backend && python manage.py migrate`
- **Create migration**: `cd backend && python manage.py makemigrations`
- **Run all tests**: `cd backend && python manage.py test`
- **Run specific test**: `cd backend && python manage.py test <app_name>.tests.<TestClass>.<test_method>`
- **Check syntax**: `cd backend && python -m py_compile <file.py>`

### Frontend (React/Vite)
- **Dev server**: `cd frontend && npm run dev`
- **Build**: `cd frontend && npm run build`
- **Lint**: `cd frontend && npm run lint`
- **Preview build**: `cd frontend && npm run preview`

### Full Stack
- **Setup environment**: `./setup.sh`
- **Activate backend venv**: `cd backend && source .venv/bin/activate`

## Code Style Guidelines

### Python/Django
- **Imports**: Standard library first, then Django, then third-party, then local
- **Models**: Use descriptive field names, add __str__ methods
- **Views**: Use DRF viewsets for CRUD operations, custom permissions classes
- **Error handling**: Use try/except blocks, return appropriate HTTP status codes
- **Naming**: snake_case for variables/functions, PascalCase for classes

### JavaScript/React
- **Components**: Functional components with hooks, named exports
- **Imports**: Group by type (React, third-party, local), sort alphabetically
- **Styling**: Use Bootstrap classes, inline styles only when necessary
- **State management**: Use React hooks (useState, useEffect, useContext)
- **API calls**: Use the centralized api.js instance with interceptors

### General
- **Comments**: Add docstrings for complex functions, avoid obvious comments
- **File structure**: Keep related files together, use descriptive names
- **Security**: Never log sensitive data, validate all inputs
- **Performance**: Use React.memo for expensive components, optimize queries

## Testing Guidelines

### Backend Tests
- Use Django's TestCase for model and view tests
- Test API endpoints with DRF's APITestCase
- Cover success and error scenarios
- Mock external services (LLMs, TTS)

### Frontend Tests
- Use React Testing Library for component tests
- Test user interactions and state changes
- Mock API calls with MSW or similar

### Test File Structure
- `backend/<app>/tests.py` for Django tests
- `frontend/src/__tests__/` for React tests

## Development Workflow

1. Create feature branch from main
2. Run linter before committing
3. Write tests for new functionality
4. Ensure all tests pass
5. Update documentation if needed

## Environment Variables

- `SECRET_KEY`: Django secret key (dev default provided)
- `VITE_BACKEND_URL`: Frontend API base URL (defaults to localhost:8000)
- Model paths for chatbot functionality

## Project Structure

```
MediMate/
├── backend/                 # Django backend
│   ├── doctorpatient/       # Main Django project
│   ├── tracker/            # Medical history tracker
│   ├── forum/              # Doctor discussion forum
│   ├── messaging/          # Real-time messaging
│   ├── translator/         # Language translation
│   ├── summarizer/         # Medical report summarization
│   ├── chatbot/            # AI medical chatbot
│   └── manage.py           # Django management script
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   └── api.js          # Centralized API client
│   └── package.json        # Frontend dependencies
└── setup.sh               # Environment setup script
```

## API Design Patterns

### RESTful Endpoints
- Use DRF viewsets for standard CRUD operations
- Follow REST conventions for URL patterns
- Return appropriate HTTP status codes
- Use serializers for data validation and transformation

### Authentication
- JWT-based authentication via django-rest-framework-simplejwt
- Access tokens expire in 60 minutes
- Refresh tokens expire in 24 hours
- Include Bearer token in Authorization header

### Error Handling
- Return descriptive error messages
- Use appropriate HTTP status codes (400, 401, 403, 404, 500)
- Handle validation errors gracefully
- Log errors for debugging but never expose sensitive information

## Security Best Practices

### Backend
- Validate all user inputs
- Use Django's built-in security features
- Implement proper permission classes
- Never store sensitive data in logs
- Use environment variables for secrets

### Frontend
- Store tokens securely in localStorage
- Implement automatic token refresh
- Validate user inputs on client side
- Use HTTPS in production
- Implement proper error boundaries

## Performance Considerations

### Backend
- Use select_related/prefetch_related for database queries
- Implement pagination for large datasets
- Cache expensive operations when appropriate
- Optimize database indexes

### Frontend
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize bundle size with code splitting
- Use efficient state management patterns

## Deployment

### Backend
- Use gunicorn for production WSGI server
- Configure proper environment variables
- Set DEBUG=False in production
- Use proper database (PostgreSQL recommended)

### Frontend
- Build optimized bundle with `npm run build`
- Serve static files from backend or CDN
- Configure proper API base URL
- Implement service worker for caching if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the guidelines above
4. Run tests and linting
5. Submit a pull request with a clear description

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Bootstrap Documentation](https://getbootstrap.com/)