const fighter = {
  state = {
    sick,
    injured
  }

  startFighting(){

  }
}

/* 
  describe how external things can influence this entity
  - eg if a manager tells a private agent to poison a fighter
    ~ the private agent has the public function that only the manager has access to because only the manager will every see the private agent object
    ~ the private agent can try to poison a fighter. a fighther doesnt have a public function called get poisoned cos anything 


    - seems ironic that they're trying to prove that you can design it so that when new stuff comes along, you can implement it without having to modify the things that uses it, but at the same time they modify the crap out of everything relating to it
    - their goal is to make the code better, and yet the end result always seems so much more convoluted than the initial position
    - to appease the principle, they make their code so overly granular that they end up with all these classes that extend all these other granular classes. and each class has like 1 or 2 lines. it ad more cognitive challenge to have to visit each class that it extends just to know what is in that class
    - and their examples are supposed to show how the entity doesnt need to change when requirements change, however, it seems theyve cherry picked an example of change, where i could see so many other possible change requests that would need to change whats in the entity regardless
    
*/


