# Contributing to StoryVerse

Thank you for your interest in contributing to StoryVerse! This document provides guidelines and instructions for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)

### Suggesting Features

Feature suggestions are welcome! Please:
- Check existing issues first
- Provide detailed use case
- Explain the benefit to users
- Consider implementation complexity

### Pull Requests

1. **Fork the repository**
   ```bash
   git fork https://github.com/Karma304/Codingskills
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow the coding standards below
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "Add feature: brief description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide clear description of changes
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

## 📝 Coding Standards

### JavaScript/Node.js

#### Style Guide
- Use ES6+ features (const, let, arrow functions)
- Use async/await instead of callbacks
- Follow consistent indentation (2 spaces)
- Use meaningful variable names
- Add comments for complex logic

#### Example:
```javascript
// Good
const fetchUserStories = async (userId) => {
  try {
    const stories = await Story.findByUserId(userId);
    return stories;
  } catch (error) {
    console.error('Failed to fetch user stories:', error);
    throw error;
  }
};

// Avoid
function fetchUserStories(userId, callback) {
  Story.findByUserId(userId, function(err, stories) {
    if (err) {
      callback(err);
    } else {
      callback(null, stories);
    }
  });
}
```

### React Native

#### Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ComponentName({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  const handleAction = () => {
    // Handler logic
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  text: {
    fontSize: 16,
  },
});
```

#### Best Practices
- Use functional components with hooks
- Destructure props and state
- Extract complex logic to custom hooks
- Use StyleSheet for styles (not inline)
- Implement proper error boundaries

### Database

#### Queries
- Always use parameterized queries
- Never concatenate user input into SQL
- Use transactions for related operations
- Add appropriate indexes for performance

#### Example:
```javascript
// Good
const query = 'SELECT * FROM stories WHERE user_id = $1';
const result = await pool.query(query, [userId]);

// Never do this
const query = `SELECT * FROM stories WHERE user_id = ${userId}`;
```

### API Design

#### Endpoint Naming
- Use plural nouns for resources: `/stories`, `/users`
- Use HTTP methods correctly: GET, POST, PUT, DELETE
- Use proper status codes
- Return consistent response format

#### Example:
```javascript
// Good
router.get('/stories/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json({ story });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Writing Tests
```javascript
describe('Story API', () => {
  test('should create a new story', async () => {
    const storyData = {
      title: 'Test Story',
      content: 'Test content',
      genre: 'Fantasy'
    };
    
    const response = await request(app)
      .post('/api/stories')
      .set('Authorization', `Bearer ${token}`)
      .send(storyData);
    
    expect(response.status).toBe(201);
    expect(response.body.story.title).toBe('Test Story');
  });
});
```

### Test Coverage
- Aim for 80%+ code coverage
- Test both success and error cases
- Include edge cases
- Mock external dependencies (AI API, database)

## 📚 Documentation

### Code Comments
```javascript
/**
 * Generates a story using AI based on user parameters
 * @param {Object} params - Story generation parameters
 * @param {string} params.genre - Story genre
 * @param {string} params.setting - Story setting/world
 * @param {Array<string>} params.characters - Character names
 * @returns {Promise<string>} Generated story content
 */
async function generateStory(params) {
  // Implementation
}
```

### README Updates
- Update README when adding features
- Keep installation instructions current
- Add examples for new functionality
- Update feature list

## 🔒 Security

### Guidelines
- Never commit secrets or API keys
- Use environment variables for configuration
- Validate and sanitize all user input
- Implement rate limiting for APIs
- Use HTTPS in production
- Keep dependencies updated

### Security Checklist
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] Authentication required for sensitive operations
- [ ] Rate limiting in place
- [ ] Error messages don't leak sensitive info

## 🎨 UI/UX Guidelines

### Design Principles
- Mobile-first approach
- Consistent spacing (use 5px increments)
- Follow Material Design guidelines
- Ensure adequate color contrast (WCAG AA)
- Touch targets minimum 44x44 pixels

### Adding New Screens
1. Create screen file in `/frontend/src/screens/`
2. Add navigation route in `App.js`
3. Follow existing styling patterns
4. Test on multiple screen sizes
5. Add loading states and error handling

## 🌍 Internationalization

### Adding Translations
```javascript
// i18n/en.json
{
  "home": {
    "title": "StoryVerse",
    "subtitle": "Your Story. Your Universe."
  }
}

// Usage
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Text>{t('home.title')}</Text>
```

## 📦 Dependencies

### Adding New Dependencies

1. **Check necessity**
   - Is it really needed?
   - Can we use existing dependencies?
   - Is it actively maintained?

2. **Verify security**
   ```bash
   npm audit
   ```

3. **Check license compatibility**
   - Prefer MIT, Apache 2.0
   - Avoid GPL for this project

4. **Update documentation**
   - Add to package.json
   - Document why it's needed
   - Update README if user-facing

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update carefully, test thoroughly
npm update package-name
```

## 🔄 Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/updates

### Commit Messages
Follow conventional commits:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(ai): add character generation endpoint
fix(auth): resolve token expiration issue
docs(api): update story endpoints documentation
```

## 🚀 Release Process

### Version Numbers
Follow Semantic Versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes

### Release Checklist
- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version number bumped
- [ ] Migration guide (if breaking changes)
- [ ] Release notes written

## 💬 Communication

### Getting Help
- Check existing issues and documentation
- Ask in discussions section
- Be respectful and patient
- Provide context and details

### Code Reviews
- Be constructive and respectful
- Focus on code, not the person
- Explain the "why" behind suggestions
- Acknowledge good solutions

## 📋 Checklist for Contributors

Before submitting a PR:
- [ ] Code follows style guidelines
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No console.log statements (except intended logging)
- [ ] No commented-out code
- [ ] Error handling implemented
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness verified

## 🎯 Priority Areas

Current priorities for contributions:
1. **Testing**: Increase test coverage
2. **Documentation**: Improve API docs and examples
3. **Accessibility**: Enhance screen reader support
4. **Performance**: Optimize database queries
5. **Features**: Collaborative writing mode

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Invited to project discussions
- Credited in documentation

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution, no matter how small, is valuable. Thank you for helping make StoryVerse better!

---

Questions? Open an issue or reach out to the maintainers.