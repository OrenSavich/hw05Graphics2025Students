# Computer Graphics - Exercise 5 - WebGL Basketball Court

## Group Members

**Full names of all group members:**

- Oren Savich
- Rotem Peled

## How to Run the Implementation

1. Clone or download this repository to your local machine.
2. Make sure you have Node.js installed.
3. In the project directory, start the local web server:
   ```sh
   node index.js
   ```
4. Open your browser and go to [http://localhost:8000](http://localhost:8000)

## Complete List of Implemented Controls

### Basketball Game Controls

- **Arrow Keys**: Move basketball horizontally (left/right) and forward/backward on court
- **W/S Keys**: Adjust shot power (0-100%) with visual indicator
- **Spacebar**: Shoot basketball toward nearest hoop
- **R Key**: Reset basketball to center court and reset camera position
- **T Key**: Reset all scoring statistics

### Camera Controls

- **O Key**: Toggle orbit camera controls
- **H Key**: Toggle HUD visibility
- **F Key**: Toggle free camera mode

### Free Camera Mode Controls

- **WASD**: Movement in free camera mode
- **QE**: Up/down movement in free camera mode
- **Arrow Keys**: Camera rotation in free camera mode

## Description of Physics System Implementation

### Core Physics Engine

Our basketball simulation implements a comprehensive physics system with realistic basketball mechanics:

**Gravity Simulation**:

- Constant downward acceleration (-9.81 \* 1.2 m/s²)
- Realistic parabolic trajectory for basketball shots
- Time-based physics calculations for smooth 60fps performance

**Collision Detection System**:

- **Ground Collision**: Ball bounces with energy loss (decay factor: 0.7)
- **Rim Collision**: Sophisticated collision detection with minimal energy loss (0.05 decay)
- **Backboard Collision**: Realistic bounce mechanics with moderate energy loss (0.4 decay)
- **Boundary Collision**: Court edge detection with controlled bouncing

**Advanced Physics Features**:

- **Air Resistance**: Realistic drag simulation (0.99 resistance factor)
- **Trajectory-Based Scoring**: Ball must pass through rim from above with proper downward velocity
- **Anti-Cheat Protection**: Prevents scoring from touching net bottom or unrealistic angles
- **Stuck Ball Detection**: Time-based position sampling prevents infinite physics loops

**Rotation Animation System**:

- **Movement-Based Rotation**: Ball rotates based on ground movement direction
- **Flight Rotation**: Dynamic rotation during basketball flight based on velocity
- **Rotation Decay**: Gradual slowdown when ball stops moving
- **Realistic Physics**: Rotation axis matches movement direction with proper scaling

**Shot Mechanics**:

- **Power-Based Velocity**: Shot strength affects initial velocity (0-100% power range)
- **Automatic Targeting**: Calculates optimal trajectory to nearest hoop
- **Arc Calculation**: Ensures proper basketball arc height for realistic shots
- **Distance-Based Scoring**: 2-point shots (inside 3-point line) vs 3-point shots

### Performance Optimizations

- **Time-Based Physics**: Prevents frame rate dependency
- **Collision Optimization**: Efficient detection algorithms
- **State Management**: Proper physics state cleanup and reset mechanisms

## Additional Features

- **Modern, interactive 3D basketball court** using Three.js
- **Orbit camera controls** (toggle with 'O' key)
- **Free camera mode** (toggle with 'F' key) with WASD movement and arrow key rotation
- **Responsive UI overlays** for score and controls
- **HUD toggle** (press 'H' to show/hide interface elements)

### Enhanced Visual Features

- **Realistic wood grain texture** on court floor with procedural generation
- **Professional team logos** at center court with custom basketball-themed design
- **Improved basketball net** with more vertical strands, horizontal rings, and natural curve
- **Enhanced backboard design** with orange borders and shooter's square matching real basketball courts
- **Professional lighting system** with ambient, spotlight, and hemisphere lighting
- **Detailed court markings** including three-point lines, key areas, free throw circles, and center court circle

### Interactive Controls

- **Camera Controls:**
  - 'O' - Toggle orbit controls
  - 'H' - Toggle HUD visibility
  - 'F' - Toggle free camera mode
- **Free Camera Mode:**
  - WASD - Movement in free camera mode
  - QE - Up/down movement in free camera mode
  - Arrow keys - Camera rotation in free camera mode

### Technical Enhancements

- **Advanced materials** with proper shininess and specular properties
- **Shadow mapping** for realistic lighting effects
- **Texture mapping** with wood grain and custom logo textures
- **Optimized geometry** for better performance
- **Professional court dimensions** matching real basketball court specifications

## Known Issues or Limitations

- Basketball movement and actions are placeholders for HW6 (currently disabled in UI)
- The application is tested on modern browsers; older browsers may not be fully supported

## External Assets and Sources

- Basketball texture: `src/basketball.png`
- Three.js library: [https://threejs.org/](https://threejs.org/)
- (List any other external assets or libraries used)

## Complete Instructions

All detailed instructions, requirements, and specifications can be found in:

- `basketball_exercise_instructions.html`

## Screenshots

### Overall view of the basketball court with hoops

![Overall view of the basketball court with hoops](screenshots/Overall%20view%20of%20the%20basketball%20court%20with%20hoops.png)

### Close-up view of basketball hoops with nets

![Close-up view of basketball hoops with nets](screenshots/Close-up%20view%20of%20basketball%20hoops%20with%20nets.png)

### View showing the basketball positioned at center court

![View showing the basketball positioned at center court](screenshots/View%20showing%20the%20basketball%20positioned%20at%20center%20court.png)

### View demonstrating camera controls functionality

![View demonstrating camera controls functionality](screenshots/View%20demonstrating%20camera%20controls%20functionality.png)

### Gameplay Video Demonstration

https://github.com/user-attachments/assets/1a42f40d-5d74-4364-bd9b-58fc941eb10f

---

If you have any questions or issues, please contact the group members listed above.
