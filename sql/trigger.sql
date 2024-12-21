/*
    boundMovieRating and boundShowRating
    Triggers that allow for Update action using condition (IF Statement) 
    on MovieRating and ShowRating.

    Sets bounds on:
        - if users set a value greater than 10 to set it to 10
        - if users set a value less than 0 to set it to 0
    This is done before any UPDATES.
*/

-- Delimiter used for GCP MySQL
DELIMITER //

CREATE TRIGGER boundMovieRating BEFORE UPDATE ON MovieRating FOR EACH ROW 
BEGIN          
    IF NEW.value > 10 THEN           
        SET NEW.value = 10;          
    ELSEIF NEW.value < 0 THEN           
        SET NEW.value = 0;          
    END IF;      
END;


CREATE TRIGGER boundShowRating BEFORE UPDATE ON ShowRating FOR EACH ROW BEGIN          
    IF NEW.value > 10 THEN           
        SET NEW.value = 10;          
    ELSEIF NEW.value < 0 THEN           
        SET NEW.value = 0;          
    END IF;         
END;

-- Delimiter used for GCP MySQL
DELIMITER ;