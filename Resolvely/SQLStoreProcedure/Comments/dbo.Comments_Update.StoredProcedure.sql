USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Update]    Script Date: 2/7/2024 9:27:11 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Author:	Kendall Stephens
-- Create date: 1/31/2023
-- Description: Update Existing Comment
-- Code Reviewer: Aurel Aliy

-- MODIFIED BY:  
-- MODIFIED DATE: 
-- Code Reviewer: 
-- =============================================
CREATE proc [dbo].[Comments_Update]
			@Id int
		   ,@Subject nvarchar(50)
		   ,@Text nvarchar(3000)

as
/*

DECLARE @Id int = 1
DECLARE @Subject nvarchar(50)= 'This comment was updated'
	   ,@Text nvarchar(3000) = 'This update was Successful with not unnessecary changes'

EXECUTE dbo.Comments_Update 
	    @Id
	   ,@Subject
	   ,@Text


*/
BEGIN


	  UPDATE [dbo].[Comments]
			
		SET	 [Subject] = @Subject 
			,[Text] = @Text
			,[DateModified] = GETUTCDATE()

      Where @Id = Id
END
GO
