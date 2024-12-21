/*
  get_rating Procedure that gets ratings given two userIds (INT) as parameters

  This will then run through all Movies and Shows both users have watched
  and compare those that both have placed reviews for and store them as cursors (movie_cursor and show_cursor).

  Next, it will loop through each and concat out Movies/Shows that both have watched where:
    - userId1 rated higher than userId2
    - userId2 rated higher than userId1
    - Both users rated them the same

  This would allow for users to have a better understanding of "Mesh" where they can see how compatible they are
  in terms of their Show/Movie likings.
*/

-- Delimiter used for GCP MySQL
DELIMITER //

CREATE PROCEDURE get_ratings(IN userId1 INT, IN userId2 INT)
BEGIN
  DECLARE movie_name VARCHAR(255);
  DECLARE movie_rating1 INT;
  DECLARE movie_rating2 INT;
  DECLARE show_name VARCHAR(255);
  DECLARE show_rating1 INT;
  DECLARE show_rating2 INT;
  DECLARE exit_loop BOOLEAN DEFAULT FALSE;
  
  -- USING JOIN (ADVANCED QUERY 1) to get Movies that both users have reviewed from MovieRating
  DECLARE movie_cursor CURSOR FOR  
    SELECT MR.name, MR.value as rating1, MR2.value as rating2 
    FROM MovieRating MR 
    INNER JOIN MovieRating MR2 ON MR.name = MR2.name 
    WHERE MR.id = userId1 AND MR2.id = userId2;

  -- USING SUBQUERY (ADVANCED QUERY 2) to get Shows that both users have reviewed from ShowRating
  DECLARE show_cursor CURSOR FOR 
    SELECT SR.name, 
      (
        SELECT value FROM ShowRating 
        WHERE id = userId1 AND name = SR.name
      ) as rating1, 
      (
        SELECT value FROM ShowRating 
        WHERE id = userId2 AND name = SR.name
      ) as rating2
    FROM ShowRating SR
    WHERE SR.id IN (userId1, userId2)
    GROUP BY SR.name -- Group by ShowRating.Name (ADVANCED QUERY)
    HAVING COUNT(DISTINCT id) = 2; 

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_loop = TRUE;
  
  SET movie_rating1 = 0;
  SET movie_rating2 = 0;
  SET show_rating1 = 0;
  SET show_rating2 = 0;
  
  -- LOOP THROUGH MOVIE RATINGS --
  OPEN movie_cursor; -- USING CURSOR
  movie_loop: LOOP -- USING LOOPING STRUCTURE
    FETCH movie_cursor INTO movie_name, movie_rating1, movie_rating2;

    IF exit_loop THEN
      LEAVE movie_loop;
    END IF;
    
    -- Processing Movie Ratings USING CONTROL STRUCTURE (IF-Statement)
    IF movie_rating1 > movie_rating2 THEN
  	  SELECT CONCAT('User ', userId1, ' rated the Movie "', movie_name, '" higher than User ', userId2, ' (', movie_rating1, ' vs ', movie_rating2, ')') AS comparison;
	  ELSEIF movie_rating1 < movie_rating2 THEN
  	  SELECT CONCAT('User ', userId2, ' rated the Movie "', movie_name, '" higher than User ', userId1, ' (', movie_rating2, ' vs ', movie_rating1, ')') AS comparison;
	  ELSE
  	  SELECT CONCAT('Both users rated "', movie_name, '" equally (', movie_rating1, ')') AS comparison;
	  END IF;
    
  END LOOP;
  
  CLOSE movie_cursor;
  
  -- LOOP THROUGH SHOW RATINGS --
  SET exit_loop = FALSE;
  OPEN show_cursor; -- USING CURSOR
  show_loop: LOOP -- USING LOOPING STRUCTURE
    FETCH show_cursor INTO show_name, show_rating1, show_rating2;
    
    IF exit_loop THEN
      LEAVE show_loop;
    END IF;
    
    -- Processing Show Ratings USING CONTROL STRUCTURE (IF-Statement)
    
    IF show_rating1 > show_rating2 THEN
  	  SELECT CONCAT('User ', userId1, ' rated the Show "', show_name, '" higher than User ', userId2, ' (', show_rating1, ' vs ', show_rating2, ')') AS comparison;
	  ELSEIF show_rating1 < show_rating2 THEN
	    SELECT CONCAT('User ', userId2, ' rated the Show "', show_name, '" higher than User ', userId1, ' (', show_rating2, ' vs ', show_rating1, ')') AS comparison;	
	  ELSE
	    SELECT CONCAT('Both users rated "', show_name, '" equally (', show_rating1, ')') AS comparison;
	  END IF;
    
  END LOOP;
  
  CLOSE show_cursor;
  
END //

-- Delimiter used for GCP MySQL
DELIMITER ;