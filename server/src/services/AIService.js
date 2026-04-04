const tf = require('@tensorflow/tfjs');

/**
 * AI Service for Predictive Risk Modeling using a Neural Network
 */
class AIService {
  constructor() {
    this.model = null;
    this.isTrained = false;
  }

  /**
   * Builds and trains the neural network on startup using historical data
   */
  async trainModel() {
    console.log('🤖 Initializing TensorFlow Neural Network...');
    
    // 1. Define Model Architecture
    this.model = tf.sequential();
    
    // Hidden layer with 8 neurons, using ReLU activation
    this.model.add(tf.layers.dense({ units: 8, inputShape: [4], activation: 'relu' }));
    
    // Output layer with 1 neuron (Sigmoid activation to get a probability between 0 and 1)
    this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    this.model.compile({ 
      optimizer: 'adam', 
      loss: 'meanSquaredError', 
      metrics: ['accuracy'] 
    });

    // 2. Generate Sample Historical Data (Simulating past insurance claims)
    // In a production app, this would be queried from your MongoDB history
    const trainingData = [];
    const outputData = [];

    for (let i = 0; i < 1000; i++) {
      const rain = Math.random(); // 0-1
      const pollution = Math.random(); // 0-1
      const traffic = Math.random(); // 0-1
      const zoneRisk = Math.random(); // 0-1

      // Underlying heuristic logic (what the AI will learn to approximate and optimize)
      // High rain and high traffic severely impact deliveries
      let calculatedRisk = (rain * 0.5) + (traffic * 0.3) + (pollution * 0.1) + (zoneRisk * 0.1);
      
      // Add randomness/noise to make the dataset realistic
      calculatedRisk += (Math.random() * 0.2 - 0.1);
      
      // Bound it between 0 and 1
      calculatedRisk = Math.max(0, Math.min(1, calculatedRisk));

      trainingData.push([rain, pollution, traffic, zoneRisk]);
      outputData.push([calculatedRisk]); // The target probability of a claim
    }

    // Convert arrays to Tensors
    const xs = tf.tensor2d(trainingData);
    const ys = tf.tensor2d(outputData);

    // 3. Train the Model
    console.log('🧠 Training AI Model with 1,000 historical records... (Epochs: 50)');
    await this.model.fit(xs, ys, { 
      epochs: 50, 
      shuffle: true, 
      verbose: 0 // set to 1 if you want to see training logs in terminal
    });
    
    this.isTrained = true;
    console.log('✅ AI Model Training Complete!');
    
    // Clean up memory
    xs.dispose();
    ys.dispose();
  }

  /**
   * Predict the risk score for a live user using the trained AI model
   */
  predictRisk(rain, pollution, traffic, zone) {
    if (!this.isTrained) {
       console.warn('AI Model not trained yet. Returning default score.');
       return 50; 
    }

    // Use tf.tidy to prevent memory leaks during real-time predictions
    return tf.tidy(() => {
      // Format the input exactly like the training data
      const input = tf.tensor2d([[rain, pollution, traffic, zone]]);
      
      // Run the prediction
      const prediction = this.model.predict(input);
      
      // Extract the probability value (0.0 to 1.0)
      const probability = prediction.dataSync()[0]; 
      
      // Convert to a 0-100 Risk Score integer
      return Math.round(probability * 100);
    });
  }
}

// Export as a singleton instance so the model persists in memory
module.exports = new AIService();
