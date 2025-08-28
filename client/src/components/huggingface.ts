// AI-powered crop analysis using Gemini
export const analyzeCrop = async (imageFile: File) => {
  try {
    // Create a description of the image for AI analysis
    const imageDescription = `Uploaded crop image for disease detection. File: ${imageFile.name}, Size: ${imageFile.size} bytes, Type: ${imageFile.type}. Please analyze for potential crop diseases and provide detailed farming advice.`;
    
    // Call our backend API for crop disease analysis
    const response = await fetch('/api/ai/crop-disease', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageDescription: imageDescription
      })
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('API request failed');
    }
  } catch (error) {
    console.error('Crop analysis error:', error);
    
    // Fallback response if API fails
    return {
      disease: "AI Analysis Unavailable",
      confidence: 50,
      description: "AI analysis service is currently unavailable. Please consult with a local agricultural expert for proper diagnosis.",
      treatments: {
        chemical: ["Consult local agricultural expert", "Apply general-purpose fungicide if needed"],
        organic: ["Neem oil spray 3ml/liter", "Maintain proper crop hygiene"]
      },
      prevention: ["Regular field monitoring", "Proper crop rotation", "Maintain field cleanliness"]
    };
  }
};