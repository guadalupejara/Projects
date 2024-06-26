USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[ShareStory_Update_isApproved]    Script Date: 1/29/2024 3:49:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Jerson Martinez
-- Create date: 1/23/2024
-- Description: A proc to update the ShareStory isApproved column
-- Code Reviewer: Xavier Robles

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[ShareStory_Update_isApproved]
				
			  @Id int 
			  ,@IsApproved bit
as

/* ----- Test Code

	Declare @Id int = 28;

	Declare @IsApproved bit = 'false'

	Execute dbo.ShareStory_Update_isApproved
				
			   @Id,
			   @IsApproved


*/

BEGIN

	Declare @datNow datetime2 = getutcdate()

UPDATE [dbo].[ShareStory]
   SET [IsApproved] = @IsApproved
      ,[DateCreated] = @datNow
      ,[DateModified] = @datNow

 WHERE Id = @Id

 END


GO
