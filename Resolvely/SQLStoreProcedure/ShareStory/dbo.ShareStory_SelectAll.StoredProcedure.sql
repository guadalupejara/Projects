USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[ShareStory_SelectAll]    Script Date: 2/5/2024 11:20:19 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author: Jerson Martinez
-- Create date: 2/1/2024
-- Description: A proc to select all
-- Code Reviewer: Edwin Chinchilla

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE proc [dbo].[ShareStory_SelectAll]

 as 
 /*

	Execute dbo.ShareStory_SelectAll
	
 */
BEGIN

SELECT [Id]
      ,[Name]
      ,[Email]
	  ,[Story]
      ,[CreatedBy]
      ,[IsApproved]
      ,[ApprovedBy]
      ,[DateCreated]
      ,[DateModified]
  FROM [dbo].[ShareStory]

END
GO
