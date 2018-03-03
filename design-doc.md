## Design
This is so that I can think things through.

### Spaceship behaviors:
- Should be able to move (in a soft, space-y way)
    - And broadcast position to server

- Should be able to move gun
    - And broadcast gun angle to server
    
- Should be able to shoot
    - And broadcast *only* a shot to the server, **should not update positions of missiles.** This will be handled by server.
    
- Should get points for shooting others


#### A player's data should include:
- Position
- Gun angle
- Points


#### A missile's data should include:
- Position
- Id of the player who shot it
###### This is only for server-side