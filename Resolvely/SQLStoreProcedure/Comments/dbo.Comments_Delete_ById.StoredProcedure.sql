USE [Resolvely]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Delete_ById]    Script Date: 2/7/2024 9:27:11 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Author:	Kendall Stephens
-- Create date: 1/31/2023
-- Description: Flip isDeleted bit to true By Id Number
-- Code Reviewer: Aurel Aliy

-- MODIFIED BY:  
-- MODIFIED DATE: 
-- Code Reviewer: 
-- =============================================

CREATE proc [dbo].[Comments_Delete_ById]
@Id int

as
/*
	DECLARE @Id int = 4
	EXECUTE dbo.comments_delete_byId @Id
*/
BEGIN

	UPDATE [dbo].[Comments]
      SET IsDeleted = 1
	  WHERE @Id = Id
END


GO
