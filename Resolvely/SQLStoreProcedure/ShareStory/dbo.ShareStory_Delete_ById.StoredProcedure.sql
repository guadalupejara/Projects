USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[ShareStory_Delete_ById]    Script Date: 1/29/2024 3:49:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Jerson Martinez
-- Create date: 1/23/2024
-- Description: A proc to delete by Id
-- Code Reviewer: Xavier Robles

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[ShareStory_Delete_ById]

				@Id int

as
/*

	Declare @Id int = 29;
			
	

	Execute dbo.ShareStory_Delete_ById @Id


*/
BEGIN
		
		DECLARE @FileIdToDelete int = (SELECT [StoryId]
							            FROM [dbo].[ShareStoryFiles]
										 WHERE StoryId = @Id)

		DELETE FROM [dbo].[ShareStoryFiles] 
		WHERE StoryId = @Id

		DELETE FROM [dbo].[ShareStory]		
		WHERE Id = @FileIdToDelete

		/*
		DELETE FROM [dbo].[ShareStory]		
		WHERE Id = @Id
		*/
END
GO
