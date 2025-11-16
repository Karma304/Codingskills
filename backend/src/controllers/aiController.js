const axios = require('axios');

const AI_API_KEY = process.env.AI_API_KEY;

exports.generateStory = async (req, res) => {
  try {
    const {
      genre,
      setting,
      characters,
      conflict,
      length,
      style,
      tone,
      plotTwist
    } = req.body;

    if (!genre || !setting) {
      return res.status(400).json({ error: 'Genre and setting are required' });
    }

    const prompt = buildStoryPrompt({
      genre,
      setting,
      characters,
      conflict,
      length,
      style,
      tone,
      plotTwist
    });

    const generatedContent = await callAIService(prompt);

    res.json({
      message: 'Story generated successfully',
      content: generatedContent,
      metadata: {
        genre,
        setting,
        characters,
        style,
        tone
      }
    });
  } catch (error) {
    console.error('Generate story error:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
};

exports.enhanceStory = async (req, res) => {
  try {
    const { content, enhancement } = req.body;

    if (!content || !enhancement) {
      return res.status(400).json({ error: 'Content and enhancement type are required' });
    }

    const prompt = buildEnhancementPrompt(content, enhancement);
    const enhancedContent = await callAIService(prompt);

    res.json({
      message: 'Story enhanced successfully',
      content: enhancedContent
    });
  } catch (error) {
    console.error('Enhance story error:', error);
    res.status(500).json({ error: 'Failed to enhance story' });
  }
};

exports.generateCharacter = async (req, res) => {
  try {
    const { name, role, personality, background } = req.body;

    const prompt = buildCharacterPrompt({ name, role, personality, background });
    const character = await callAIService(prompt);

    res.json({
      message: 'Character generated successfully',
      character: character
    });
  } catch (error) {
    console.error('Generate character error:', error);
    res.status(500).json({ error: 'Failed to generate character' });
  }
};

function buildStoryPrompt({
  genre,
  setting,
  characters = [],
  conflict,
  length = 'medium',
  style = 'descriptive',
  tone = 'neutral',
  plotTwist = false
}) {
  let prompt = `Write a ${length} ${genre} story set in ${setting}. `;

  if (characters.length > 0) {
    prompt += `The main characters are: ${characters.map(c => c.name || c).join(', ')}. `;
  }

  if (conflict) {
    prompt += `The central conflict is: ${conflict}. `;
  }

  prompt += `Write in a ${style} style with a ${tone} tone. `;

  if (plotTwist) {
    prompt += `Include an unexpected plot twist. `;
  }

  const lengthGuide = {
    'short': '500-800 words',
    'medium': '1000-1500 words',
    'long': '2000-3000 words'
  };

  prompt += `Target length: approximately ${lengthGuide[length] || lengthGuide['medium']}.`;

  return prompt;
}

function buildEnhancementPrompt(content, enhancement) {
  const enhancements = {
    'more-dramatic': 'Make this story more dramatic and intense',
    'more-dialogue': 'Add more dialogue and character interactions',
    'more-description': 'Add more vivid descriptions and world-building details',
    'add-twist': 'Add an unexpected plot twist',
    'darker': 'Make the tone darker and more serious',
    'lighter': 'Make the tone lighter and more humorous',
    'faster-pace': 'Increase the pacing and action',
    'slower-pace': 'Slow down the pacing with more detail'
  };

  const enhancementInstruction = enhancements[enhancement] || enhancement;

  return `${enhancementInstruction}:\n\n${content}`;
}

function buildCharacterPrompt({ name, role, personality, background }) {
  let prompt = 'Create a detailed character profile. ';

  if (name) {
    prompt += `Name: ${name}. `;
  }

  if (role) {
    prompt += `Role: ${role}. `;
  }

  if (personality) {
    prompt += `Personality traits: ${personality}. `;
  }

  if (background) {
    prompt += `Background: ${background}. `;
  }

  prompt += 'Include physical description, motivations, strengths, weaknesses, and backstory.';

  return prompt;
}

async function callAIService(prompt) {
  if (!AI_API_KEY) {
    return generateMockResponse(prompt);
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a creative storytelling assistant that helps users write engaging stories.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.8
      },
      {
        headers: {
          'Authorization': `Bearer ${AI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI API error:', error.message);
    return generateMockResponse(prompt);
  }
}

function generateMockResponse(prompt) {
  if (prompt.includes('character profile')) {
    return {
      name: 'Generated Character',
      age: '25',
      appearance: 'Tall with dark hair and piercing eyes',
      personality: 'Brave, resourceful, and determined',
      background: 'Comes from a small village but dreams of adventure',
      motivations: 'To protect those they love and uncover ancient secrets',
      strengths: 'Quick thinking, skilled in combat',
      weaknesses: 'Sometimes too trusting, fears losing loved ones'
    };
  }

  return `This is a generated story based on your prompt. In a production environment, this would be generated by an AI service like GPT-4.

The story begins with intrigue and mystery, drawing readers into a world filled with wonder and possibility. Characters face challenges that test their resolve, relationships that shape their journey, and discoveries that change everything they thought they knew.

Through vivid descriptions and compelling dialogue, the narrative unfolds naturally, building tension and emotional resonance. Each scene connects seamlessly to the next, creating a cohesive and engaging reading experience.

The climax brings all elements together in a satisfying resolution that honors the story's themes while leaving room for reflection and imagination.`;
}

module.exports = exports;
