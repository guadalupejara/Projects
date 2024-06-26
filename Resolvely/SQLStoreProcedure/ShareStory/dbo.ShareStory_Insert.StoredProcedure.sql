USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[ShareStory_Insert]    Script Date: 1/29/2024 3:49:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Jerson Martinez
-- Create date: 1/23/2024
-- Description: A proc to insert ShareStory
-- Code Reviewer: Xavier Robles

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[ShareStory_Insert]

			@Name nvarchar(50)
           ,@Email nvarchar(50)
           ,@Story nvarchar(3000)
           ,@CreatedBy int
           ,@IsApproved bit
           ,@ApprovedBy int
				,@BatchStoryFiles as dbo.BatchStoryFiles READONLY
		   ,@Id int OUTPUT
		   
as 

/* ------- Test Code ------

	Declare @Id int =0
		   ,@Name nvarchar(50) = 'Jerson'
           ,@Email nvarchar(50) = 'myrealemail@gmail.com'
           ,@Story nvarchar(3000) = 'long story'
           ,@CreatedBy int = 1
           ,@IsApproved bit = 1 
           ,@ApprovedBy int = 1;

	Declare @BatchStoryFiles dbo.BatchStoryFiles;
			INSERT INTO @BatchStoryFiles (FileId)
			VALUES (3);

		   execute [dbo].[ShareStory_Insert]

		   @Name 
           ,@Email
           ,@Story 
           ,@CreatedBy 
           ,@IsApproved 
           ,@ApprovedBy 
		   ,@BatchStoryFiles
		   ,@Id OUTPUT


		
*/



BEGIN 

INSERT INTO [dbo].[ShareStory]
           ([Name]
           ,[Email]
           ,[Story]
           ,[CreatedBy]
           ,[IsApproved]
           ,[ApprovedBy])
     VALUES
           (@Name
           ,@Email
           ,@Story
           ,@CreatedBy
           ,@IsApproved 
           ,@ApprovedBy)

	SET @Id = SCOPE_IDENTITY()

	INSERT INTO dbo.ShareStoryFiles (StoryId, FileId)
	SELECT @Id, bs.FileId
	FROM @BatchStoryFiles AS bs
	WHERE NOT EXISTS (
		SELECT 1
		FROM dbo.ShareStoryFiles AS ss
		WHERE ss.StoryId = @Id
		  AND ss.FileId = bs.FileId
	);
	
END
GO
